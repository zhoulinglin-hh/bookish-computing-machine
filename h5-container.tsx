# 用户认证

> 仅在用户明确要求登录功能时才实现认证。默认设计应支持匿名访问。

## 认证方法

### 用户名登录（默认方式）
**需要登录功能时**，优先采用用户名登录，自动生成 `{username}@meoo.local` 虚拟邮箱以兼容 Supabase 认证系统。


### 微信登录
小程序场景**默认**实现「微信一键登录 + 账号密码登录」双入口。


### 手机号登录
把手机号当作用户名（非短信验证码），同样自动生成 `{username}@meoo.local` 虚拟邮箱 + 密码登录。

### 邮箱登录
仅在用户明确要求使用真实邮箱时才使用的标准邮箱/密码认证。

## ❌ 不支持的登录方式

以下登录方式 **不支持**，如果用户要求请明确告知无法实现：

- **手机验证码登录（短信 OTP）**：不支持短信验证码


- **第三方登录**：不支持 QQ、支付宝、GitHub 等第三方登录

- **扫码登录**：不支持二维码扫码登录
- **指纹/面部识别**：不支持生物识别登录

**如果用户要求以上登录方式，请明确说明 Meoo Cloud 目前仅支持用户名/密码登录。**

## 实现要点

### 1. 存储完整会话对象
```typescript
const [session, setSession] = useState<Session | null>(null);
```

### 2. 用户名认证示例
**实现登录注册时必须使用此方式**，除非用户明确要求使用真实邮箱：
```typescript
// 注册
await supabase.auth.signUp({
  email: `${username}@meoo.local`,
  password,
  options: { data: { username } }
});

// 登录
await supabase.auth.signInWithPassword({
  email: `${username}@meoo.local`,
  password,
});
```

### 3. 认证状态监听
```typescript
// ✅ 正确：同步状态更新 + 在 effect cleanup 里 unsubscribe
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    setSession(session);
    setUser(session?.user ?? null);

    // 延迟任何 Supabase 调用
    if (session?.user) {
      setTimeout(() => {
        fetchUserProfile(session.user.id);
      }, 0);
    }
  });
  return () => subscription.unsubscribe();
}, []);

// ❌ 错误：会导致死锁
supabase.auth.onAuthStateChange(async (event, session) => {
  const profile = await supabase.from('profiles').select()... // 死锁
});
```

## 用户数据表设计




### 用户配置文件表
小程序场景的 `profiles` 同时承接「账号密码登录」和「微信登录」两种来源——`username` 由账密注册写入，`openid`/`unionid` 由微信登录写入；登录方式增加字段时按需扩展即可。

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,    -- 账号密码登录写入
  openid TEXT UNIQUE,      -- 微信登录写入
  unionid TEXT UNIQUE,
  nickname TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_select_own_profile ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY users_update_own_profile ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
```

### 自动创建配置文件触发器

根据 `raw_user_meta_data.provider` 分流——微信渠道写入 `openid`/`unionid`，账号密码渠道写入 `username`：

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.raw_user_meta_data ->> 'provider' = 'wechat_miniprogram' THEN
    INSERT INTO public.profiles (id, openid, unionid)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'openid', NEW.raw_user_meta_data ->> 'unionid')
    ON CONFLICT (id) DO NOTHING;
  ELSE
    INSERT INTO public.profiles (id, username)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'username')
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

> 不要忘记 `SECURITY DEFINER`！


### 业务表与用户关联

如果需要在业务表中引用用户信息，请引用 profiles 表的 `id`：

```sql
CREATE TABLE public.user_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.user_posts ENABLE ROW LEVEL SECURITY;

-- 用户只能查看和操作自己的帖子
CREATE POLICY users_select_own_posts ON public.user_posts
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY users_insert_own_posts ON public.user_posts
FOR INSERT WITH CHECK (user_id = auth.uid());

-- UPDATE 必须同时给 USING 和 WITH CHECK，否则用户能把别人的帖子改到自己名下后再修改
CREATE POLICY users_update_own_posts ON public.user_posts
FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
```

### 角色和权限设计

角色**必须**存储在独立表中，不要在 profiles 表中存储角色：

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 用户能读到自己的角色
CREATE POLICY users_select_own_roles ON public.user_roles
FOR SELECT USING (user_id = auth.uid());

-- 辅助函数检查用户角色
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

## 创建测试用户

```sql
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  created_at, updated_at,
  confirmation_token, recovery_token,
  email_change_token_new, email_change,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(), 'authenticated', 'authenticated',
  'testuser@meoo.local',
  crypt('password123', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '', '', '', '',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"username":"testuser"}'::jsonb,
  false
);
```

必需字段：`instance_id`、`::jsonb` 类型转换、空字符串令牌（非 NULL）


---

## 微信小程序登录

### 实现流程

模板预置：

- `functions/wx-mp-login/index.ts` + `src/supabase/wx-mp-login.ts`（封装好的 `wxMpLogin()` / `WxMpConfigMissingError`）
- `src/api/auth.ts`、`src/store/auth-store.ts`（含 `signInWithWeapp` / `signInWithUsername` / `signUpWithUsername` 等 action，用户名内部自动包 `{username}@meoo.local`）
- `src/pages/login/index.tsx`：微信一键登录 + 账号密码 + 注册切换的双入口登录页

按顺序：

1. **部署云函数**（必须 `-j false`，登录前没 token）：
   ```bash
   meoo-cli cloud deploy-function -n wx-mp-login -j false
   ```
2. **建 profiles 表**（见前文「用户数据表设计」）。
3. **启用模板登录链路**：`src/app.config.ts` 加 `pages/login/index`。`auth-store` 模块加载即自动订阅 supabase，无需在 `app.tsx` 触发 init。登录页文案、布局可改，鉴权骨架不要重写。
4. **总结提醒**：消息末尾单独成段提醒用户去「云服务 → 登录认证 → 微信登录」配密钥（见文末模板）。

### 环境变量（用户手动到「云服务 → 登录认证 → 微信登录」配）

| 变量 | 来源 |
|---|---|
| `WX_APP_ID` | 微信小程序后台 |
| `WX_APP_SECRET` | 微信小程序后台 |

### 登录 UI

「我的」Tab + 模板 `pages/login/index` 两个页面。登录入口收口在「我的」，不要散落在首页。「我的」Tab 未登录展示登录入口（`redirectToLogin`），已登录展示头像、昵称、登出。

展示用户身份：昵称兜底 `nickname || username || '微信用户'`，头像为空给本地兜底图。**禁止展示** `email`（`{username}@meoo.local/wx.local` 占位符）和 `openid` / `user.id`（内部标识）。

### 完善头像昵称（可选，默认不用实现）

如果要求获取头像昵称，必须遵守 `Taro.getUserProfile()` 的两条**硬性平台规则**，违反会直接调用失败：

1. **必须由用户主动触发**：只能在 button/view 等用户事件的**同步回调**里直接调用。**禁止**在 `useLoad` / `useDidShow` / `useEffect` / 异步 callback / `setTimeout` 里自动调用 —— 平台会拒绝。
2. **每次调用都需要用户明确授权**：不要紧跟登录流程静默触发。**正确做法是在「我的」页面挂一个独立的「完善头像昵称」按钮**，需要时由用户主动点击触发授权；获取头像昵称应当与登录流程**解耦**。

✅ 正确：在「我的」页面挂独立按钮，登录与"完善资料"解耦（用 `useAuthStore` 拿 user，profile 更新走业务自建的 `src/api/profile.ts`，不要在页面里 `import { supabase }`）：

```typescript
import { useAuthStore } from '@/store/auth-store';
import * as profileApi from '@/api/profile';

// 「我的」页面：未填写头像/昵称时展示一个「完善头像昵称」按钮
async function handleSetProfile() {
  // 必须在 onClick 同步调用，不要 await 别的 promise 后再调
  const { userInfo } = await Taro.getUserProfile({ desc: '用于完善个人资料' });
  const { user } = useAuthStore.getState();
  if (!user) return;
  try {
    await profileApi.updateProfile(user.id, {
      nickname: userInfo.nickName,
      avatar_url: userInfo.avatarUrl,
    });
    Taro.showToast({ title: '已更新', icon: 'success' });
  } catch (e) {
    Taro.showToast({ title: (e as Error).message, icon: 'none' });
  }
}
```

### 总结里必须出现的提醒文案

实现完微信登录后，回复用户的最终总结的末尾**必须**单独成段，原文：

>  **下一步你要手动做一件事**：到「云服务 → 登录认证 → 微信登录」配置 `WX_APP_ID` 和 `WX_APP_SECRET`。


