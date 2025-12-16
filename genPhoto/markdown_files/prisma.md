# Prisma 关系模型详解

Prisma 是一个现代化的 Node.js 和 TypeScript ORM，它提供了强大的关系模型支持。本文将详细介绍 Prisma 中的三种主要关系类型：**一对一（One-to-One）**、**一对多（One-to-Many）** 和 **多对多（Many-to-Many）**，以及它们对应的增删改查操作。

---

## 📋 目录

1. [一对一关系（One-to-One）](#一对一关系one-to-one)
2. [一对多关系（One-to-Many）](#一对多关系one-to-many)
3. [多对多关系（Many-to-Many）](#多对多关系many-to-many)
4. [关系查询技巧](#关系查询技巧)

---

## 一对一关系（One-to-One）

### 🔧 Schema 定义

一对一关系表示两个模型之间只能有一条记录相互关联。例如：用户（User）和用户资料（Profile）。

```prisma
// schema.prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  profile Profile? // 可选的一对一关系
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  avatar String?
  userId Int    @unique  // 外键，必须唯一以确保一对一
  user   User   @relation(fields: [userId], references: [id])
}
```

**关键点：**
- `@unique` 约束在外键字段上确保一对一关系
- 关系可以是必需的或可选的（使用 `?`）
- `@relation` 指定外键字段和引用字段

### ✏️ 增（Create）

```typescript
// 方式1：同时创建 User 和 Profile（嵌套创建）
const userWithProfile = await prisma.user.create({
  data: {
    email: "alice@example.com",
    name: "Alice",
    profile: {
      create: {
        bio: "I love coding!",
        avatar: "https://example.com/avatar.png"
      }
    }
  },
  include: {
    profile: true  // 返回结果中包含 profile
  }
})

// 方式2：先创建 User，再创建 Profile
const user = await prisma.user.create({
  data: {
    email: "bob@example.com",
    name: "Bob"
  }
})

const profile = await prisma.profile.create({
  data: {
    bio: "Hello World!",
    userId: user.id
  }
})

// 方式3：使用 connect 连接已存在的记录
const newProfile = await prisma.profile.create({
  data: {
    bio: "New profile",
    user: {
      connect: { id: 1 }  // 连接到 id 为 1 的用户
    }
  }
})
```

### 📖 查（Read）

```typescript
// 查询用户及其资料
const userWithProfile = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    profile: true
  }
})

// 使用 select 精确选择字段
const userProfile = await prisma.user.findUnique({
  where: { email: "alice@example.com" },
  select: {
    name: true,
    profile: {
      select: {
        bio: true,
        avatar: true
      }
    }
  }
})

// 从 Profile 侧查询
const profileWithUser = await prisma.profile.findUnique({
  where: { userId: 1 },
  include: {
    user: true
  }
})
```

### 🔄 改（Update）

```typescript
// 更新用户的 Profile
const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: {
    profile: {
      update: {
        bio: "Updated bio!"
      }
    }
  },
  include: {
    profile: true
  }
})

// 使用 upsert：存在则更新，不存在则创建
const upsertProfile = await prisma.user.update({
  where: { id: 1 },
  data: {
    profile: {
      upsert: {
        create: {
          bio: "New profile created"
        },
        update: {
          bio: "Profile updated"
        }
      }
    }
  }
})

// 直接更新 Profile
const updatedProfile = await prisma.profile.update({
  where: { userId: 1 },
  data: {
    bio: "Directly updated bio"
  }
})
```

### 🗑️ 删（Delete）

```typescript
// 删除 Profile（保留 User）
const deletedProfile = await prisma.profile.delete({
  where: { userId: 1 }
})

// 删除 User 时级联删除 Profile（需要在 schema 中配置）
// 首先修改 schema：
// model Profile {
//   ...
//   user User @relation(fields: [userId], references: [id], onDelete: Cascade)
// }

const deletedUser = await prisma.user.delete({
  where: { id: 1 }
})

// 断开关系（不删除记录）
const disconnectProfile = await prisma.user.update({
  where: { id: 1 },
  data: {
    profile: {
      disconnect: true
    }
  }
})
```

---

## 一对多关系（One-to-Many）

### 🔧 Schema 定义

一对多关系是最常见的关系类型。例如：用户（User）和文章（Post）。

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]  // 一个用户可以有多篇文章
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
}
```

**关键点：**
- 父模型使用数组类型 `Post[]`
- 子模型包含外键字段 `authorId`
- 外键不需要 `@unique`（与一对一的区别）

### ✏️ 增（Create）

```typescript
// 方式1：创建 User 时同时创建多个 Post
const userWithPosts = await prisma.user.create({
  data: {
    email: "writer@example.com",
    name: "Writer",
    posts: {
      create: [
        { title: "First Post", content: "Hello World!" },
        { title: "Second Post", content: "Prisma is awesome!" }
      ]
    }
  },
  include: {
    posts: true
  }
})

// 方式2：为已存在的 User 创建 Post
const newPost = await prisma.post.create({
  data: {
    title: "New Article",
    content: "Content here...",
    author: {
      connect: { id: 1 }
    }
  }
})

// 方式3：使用 createMany 批量创建（不支持嵌套）
const manyPosts = await prisma.post.createMany({
  data: [
    { title: "Post 1", authorId: 1 },
    { title: "Post 2", authorId: 1 },
    { title: "Post 3", authorId: 1 }
  ]
})

// 方式4：连接多个已存在的 Post 到 User
const userWithConnectedPosts = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      connect: [
        { id: 10 },
        { id: 11 },
        { id: 12 }
      ]
    }
  }
})
```

### 📖 查（Read）

```typescript
// 查询用户及其所有文章
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true
  }
})

// 带条件的关联查询
const userWithPublishedPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5  // 限制数量
    }
  }
})

// 过滤：只返回有已发布文章的用户
const usersWithPublishedPosts = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        published: true
      }
    }
  }
})

// 使用 _count 获取关联记录数量
const usersWithPostCount = await prisma.user.findMany({
  include: {
    _count: {
      select: { posts: true }
    }
  }
})

// 查询文章及其作者
const postWithAuthor = await prisma.post.findUnique({
  where: { id: 1 },
  include: {
    author: true
  }
})
```

### 🔄 改（Update）

```typescript
// 更新用户的特定文章
const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      update: {
        where: { id: 5 },
        data: { published: true }
      }
    }
  }
})

// 批量更新用户的所有文章
const updateManyPosts = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      updateMany: {
        where: { published: false },
        data: { published: true }
      }
    }
  }
})

// 使用 set 替换所有关联（断开旧的，连接新的）
const replaceAllPosts = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      set: [{ id: 20 }, { id: 21 }]  // 只保留这些文章
    }
  }
})

// 混合操作：同时创建、连接、更新
const complexUpdate = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      create: { title: "Brand New Post" },
      connect: { id: 30 },
      update: {
        where: { id: 5 },
        data: { title: "Updated Title" }
      }
    }
  }
})
```

### 🗑️ 删（Delete）

```typescript
// 删除用户的特定文章
const deletePost = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      delete: { id: 5 }
    }
  }
})

// 批量删除用户的文章
const deleteManyPosts = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      deleteMany: {
        published: false  // 删除所有未发布的文章
      }
    }
  }
})

// 断开关联（不删除记录，只移除关系）
const disconnectPost = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      disconnect: [{ id: 10 }, { id: 11 }]
    }
  }
})

// 直接删除 Post
const deletedPost = await prisma.post.delete({
  where: { id: 1 }
})

// 级联删除（需要配置 onDelete: Cascade）
const deletedUserWithPosts = await prisma.user.delete({
  where: { id: 1 }
})
```

---

## 多对多关系（Many-to-Many）

### 🔧 Schema 定义

多对多关系有两种定义方式：**隐式（Implicit）** 和 **显式（Explicit）**。

#### 隐式多对多（推荐简单场景）

```prisma
model Post {
  id         Int        @id @default(autoincrement())
  title      String
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}
```

Prisma 会自动创建中间表 `_CategoryToPost`。

#### 显式多对多（需要存储额外数据时使用）

```prisma
model Post {
  id         Int            @id @default(autoincrement())
  title      String
  categories CategoriesOnPosts[]
}

model Category {
  id    Int                 @id @default(autoincrement())
  name  String              @unique
  posts CategoriesOnPosts[]
}

// 显式中间表
model CategoriesOnPosts {
  post       Post     @relation(fields: [postId], references: [id])
  postId     Int
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId Int
  assignedAt DateTime @default(now())  // 额外字段
  assignedBy String                     // 额外字段

  @@id([postId, categoryId])  // 复合主键
}
```

### ✏️ 增（Create）- 隐式多对多

```typescript
// 创建 Post 时同时创建 Category
const postWithCategories = await prisma.post.create({
  data: {
    title: "Learn Prisma",
    categories: {
      create: [
        { name: "Database" },
        { name: "TypeScript" }
      ]
    }
  },
  include: {
    categories: true
  }
})

// 创建 Post 并连接已存在的 Category
const postWithExistingCategories = await prisma.post.create({
  data: {
    title: "Advanced TypeScript",
    categories: {
      connect: [
        { id: 1 },
        { name: "TypeScript" }  // 也可以用 unique 字段
      ]
    }
  }
})

// 使用 connectOrCreate：存在则连接，不存在则创建
const post = await prisma.post.create({
  data: {
    title: "New Post",
    categories: {
      connectOrCreate: [
        {
          where: { name: "JavaScript" },
          create: { name: "JavaScript" }
        },
        {
          where: { name: "Node.js" },
          create: { name: "Node.js" }
        }
      ]
    }
  }
})
```

### ✏️ 增（Create）- 显式多对多

```typescript
// 在显式中间表中创建关系并添加额外数据
const postWithCategory = await prisma.post.create({
  data: {
    title: "My Post",
    categories: {
      create: {
        assignedBy: "admin",
        category: {
          connect: { id: 1 }
        }
      }
    }
  },
  include: {
    categories: {
      include: {
        category: true
      }
    }
  }
})

// 直接在中间表创建
const relation = await prisma.categoriesOnPosts.create({
  data: {
    postId: 1,
    categoryId: 2,
    assignedBy: "editor",
    assignedAt: new Date()
  }
})
```

### 📖 查（Read）

```typescript
// 查询 Post 及其所有 Category（隐式）
const postWithCategories = await prisma.post.findUnique({
  where: { id: 1 },
  include: {
    categories: true
  }
})

// 查询 Category 及其所有 Post
const categoryWithPosts = await prisma.category.findUnique({
  where: { name: "TypeScript" },
  include: {
    posts: true
  }
})

// 带过滤条件的查询
const filteredCategories = await prisma.post.findUnique({
  where: { id: 1 },
  include: {
    categories: {
      where: {
        name: { contains: "Script" }
      }
    }
  }
})

// 查询同时属于多个 Category 的 Post
const postsInMultipleCategories = await prisma.post.findMany({
  where: {
    AND: [
      { categories: { some: { name: "TypeScript" } } },
      { categories: { some: { name: "Database" } } }
    ]
  }
})

// 显式多对多：查询包含中间表数据
const postWithFullInfo = await prisma.post.findUnique({
  where: { id: 1 },
  include: {
    categories: {
      include: {
        category: true
      }
    }
  }
})
```

### 🔄 改（Update）

```typescript
// 添加新的 Category 到已有 Post
const addCategories = await prisma.post.update({
  where: { id: 1 },
  data: {
    categories: {
      connect: [{ id: 3 }, { id: 4 }]
    }
  }
})

// 移除某些 Category
const removeCategories = await prisma.post.update({
  where: { id: 1 },
  data: {
    categories: {
      disconnect: [{ id: 3 }]
    }
  }
})

// 完全替换所有 Category（set）
const replaceCategories = await prisma.post.update({
  where: { id: 1 },
  data: {
    categories: {
      set: [{ id: 5 }, { id: 6 }]  // 只保留这些
    }
  }
})

// 混合操作
const mixedUpdate = await prisma.post.update({
  where: { id: 1 },
  data: {
    categories: {
      connect: { id: 10 },
      disconnect: { id: 2 },
      create: { name: "New Category" }
    }
  }
})

// 显式多对多：更新中间表数据
const updateRelation = await prisma.categoriesOnPosts.update({
  where: {
    postId_categoryId: {
      postId: 1,
      categoryId: 2
    }
  },
  data: {
    assignedBy: "new_editor"
  }
})
```

### 🗑️ 删（Delete）

```typescript
// 断开所有 Category（不删除 Category 记录）
const disconnectAll = await prisma.post.update({
  where: { id: 1 },
  data: {
    categories: {
      set: []  // 清空所有关联
    }
  }
})

// 断开特定 Category
const disconnectSome = await prisma.post.update({
  where: { id: 1 },
  data: {
    categories: {
      disconnect: [{ id: 1 }, { id: 2 }]
    }
  }
})

// 显式多对多：删除中间表记录
const deleteRelation = await prisma.categoriesOnPosts.delete({
  where: {
    postId_categoryId: {
      postId: 1,
      categoryId: 2
    }
  }
})

// 删除 Category（会自动删除关联关系）
const deleteCategory = await prisma.category.delete({
  where: { id: 1 }
})
```

---

## 关系查询技巧

### 🔍 Fluent API 链式查询

```typescript
// 通过关系链获取数据
const userPosts = await prisma.user
  .findUnique({ where: { id: 1 } })
  .posts()

const postAuthor = await prisma.post
  .findUnique({ where: { id: 1 } })
  .author()
```

### 📊 聚合与统计

```typescript
// 获取每个用户的文章数量
const usersWithPostCount = await prisma.user.findMany({
  include: {
    _count: {
      select: { posts: true }
    }
  }
})

// 带条件的计数
const usersWithPublishedCount = await prisma.user.findMany({
  include: {
    _count: {
      select: {
        posts: { where: { published: true } }
      }
    }
  }
})
```

### ⚡ 性能优化

```typescript
// 使用 select 取代 include 减少数据传输
const optimizedQuery = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    posts: {
      select: {
        id: true,
        title: true
      },
      take: 3
    }
  }
})

// 分页加载关联数据
const paginatedPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      skip: 10,
      take: 10,
      orderBy: { createdAt: 'desc' }
    }
  }
})
```

---

## 🎯 总结对比表

| 操作 | 一对一 | 一对多 | 多对多 |
|------|--------|--------|--------|
| **创建** | `create` / `connect` | `create` / `createMany` / `connect` | `create` / `connect` / `connectOrCreate` |
| **查询** | `include` / `select` | `include` + 过滤/排序/分页 | `include` + 过滤 |
| **更新** | `update` / `upsert` | `update` / `updateMany` / `set` | `connect` / `disconnect` / `set` |
| **删除** | `delete` / `disconnect` | `delete` / `deleteMany` / `disconnect` | `disconnect` / `set: []` |

---

## 📚 参考资源

- [Prisma 官方文档 - Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [Prisma Client API - Relation queries](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries)
- [Prisma 最佳实践](https://www.prisma.io/docs/guides)