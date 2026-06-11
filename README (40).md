# 文件存储

## 创建存储桶

通过 SQL 迁移创建存储桶：

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);
```

## 关键上传方法




**统一使用 taro-project 模板自带的 `@/lib/upload`**（`selectMediaFiles` / `selectMessageFile` / `uploadToSupabase`）在前端直接上传。完整 API 与约束见 taro-project SKILL.md 的「文件上传」一节。

- 选图：`selectMediaFiles`（内部用 `Taro.chooseMedia`）
- 选文档：`selectMessageFile`
- 上传：`uploadToSupabase(file, { bucket })`，小程序传 `tempFilePath` 字符串、Web 传 `File`，SDK 按 `contentType` 自动处理

```typescript
import { selectMediaFiles, uploadToSupabase } from '@/lib/upload';
import { supabase } from '@/supabase/client';
import Taro from '@tarojs/taro';

const files = await selectMediaFiles({ count: 1, mediaType: ['image'] });
if (files.length === 0) return;

const result = await uploadToSupabase(files[0], { bucket: 'avatars' });
if (!result.success) {
  Taro.showToast({ title: result.error || '上传失败', icon: 'none' });
  return;
}
const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(result.data.path);
```


## 存储 RLS 策略

```sql
-- 创建存储桶的 RLS 策略
CREATE POLICY anon_select_avatars ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY users_insert_avatars ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);
```

## Edge Functions 存储限制



**对小程序同样适用**：所有上传必须在前端调用 `uploadToSupabase`（参见「关键上传方法」），在 Edge Function 中执行存储上传不被允许。


## 存储模式限制

不要在 `storage` 模式中执行以下操作：
- 创建自定义表或函数
- 删除现有表或函数
- 在现有存储表上创建索引
- 对 `storage.migrations` 执行破坏性操作

管理文件访问请在 `public` 模式中创建辅助函数。