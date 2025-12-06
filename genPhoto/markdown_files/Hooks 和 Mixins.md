## Hooks vs Mixins

### 1. 命名冲突问题

#### Mixins 的问题

```javascript
// userMixin.js
export const userMixin = {
  data() {
    return {
      name: "default name", // 可能与其他 mixin 或组件的 name 冲突
      loading: false, // 常见的命名，很容易冲突
    };
  },
  methods: {
    load() {
      // 方法名也可能冲突
      this.loading = true;
    },
  },
};

// otherMixin.js
export const otherMixin = {
  data() {
    return {
      name: "other name", // 会覆盖 userMixin 中的 name
      loading: true, // 会覆盖 userMixin 中的 loading
    };
  },
};
```

#### Hooks 的解决方案

```javascript
// useUser.js
export function useUser() {
  const userName = ref("default name");
  const userLoading = ref(false);

  const loadUser = () => {
    userLoading.value = true;
  };

  return {
    userName,
    userLoading,
    loadUser,
  };
}

// useOther.js
export function useOther() {
  const otherName = ref("other name");
  const otherLoading = ref(true);

  return {
    otherName,
    otherLoading,
  };
}

// 使用时可以通过解构重命名避免冲突
const { userName: firstUserName, userLoading: firstUserLoading } = useUser();

const { userName: secondUserName, userLoading: secondUserLoading } = useUser();
```

### 2. 逻辑复用和参数传递

#### Mixins 的局限性

```javascript
// 使用 mixin，无法传递参数来改变行为
export const userMixin = {
  data() {
    return {
      name: "default name",
    };
  },
  created() {
    // 无法自定义初始值
    this.loadUser();
  },
  methods: {
    loadUser() {
      // 固定的逻辑，难以定制
    },
  },
};
```

#### Hooks 的灵活性

```javascript
export function useUser(initialName = "default name", options = {}) {
  const name = ref(initialName);
  const { immediate = true, delay = 0 } = options;

  const loadUser = async () => {
    if (delay) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    // 可定制的逻辑
  };

  if (immediate) {
    loadUser();
  }

  return {
    name,
    loadUser,
  };
}

// 使用时可以传递参数
const { name: userName1 } = useUser("张三", { immediate: false });
const { name: userName2 } = useUser("李四", { delay: 1000 });
```

### 3. 数据来源的清晰度

#### Mixins 的问题

```javascript
export default {
  mixins: [userMixin, otherMixin],
  created() {
    console.log(this.name); // 不清楚 name 来自哪个 mixin
    console.log(this.loading); // 不清楚 loading 来自哪个 mixin
  },
};
```

#### Hooks 的清晰性

```javascript
export default {
  setup() {
    // 数据来源清晰
    const { userName, userLoading } = useUser();
    const { otherName, otherLoading } = useOther();

    return {
      userName, // 清楚来自 useUser
      userLoading, // 清楚来自 useUser
      otherName, // 清楚来自 useOther
      otherLoading, // 清楚来自 useOther
    };
  },
};
```

### 4. 代码组织和维护

#### Mixins 的问题

```javascript
// 多个 mixin 的逻辑分散，难以追踪
export default {
  mixins: [
    userMixin,
    authMixin,
    routerMixin,
    validationMixin,
    // 更多 mixins...
  ],
  // 组件自身的逻辑
  methods: {
    // 可能被某个 mixin 覆盖或与之冲突
    someMethod() {},
  },
};
```

#### Hooks 的组织性

```javascript
export default {
  setup() {
    // 按功能清晰组织
    const { user, loading: userLoading } = useUser();
    const { isAuthenticated, login } = useAuth();
    const { route, navigate } = useRouter();
    const { validate, errors } = useValidation();

    // 业务逻辑清晰可见
    const handleSubmit = async () => {
      if (await validate()) {
        await login(user.value);
        navigate("/dashboard");
      }
    };

    return {
      user,
      userLoading,
      isAuthenticated,
      errors,
      handleSubmit,
    };
  },
};
```

### 5. 总结对比

1. 命名冲突：

   - Mixins：容易发生冲突，难以追踪
   - Hooks：可以通过解构重命名避免冲突

2. 逻辑复用：

   - Mixins：复用能力有限，难以传参
   - Hooks：高度可复用，支持参数配置

3. 数据来源：

   - Mixins：数据来源不清晰
   - Hooks：数据来源清晰可见

4. 代码组织：

   - Mixins：逻辑分散，难以维护
   - Hooks：逻辑集中，易于维护

5. 类型支持：
   - Mixins：类型推导较弱
   - Hooks：完善的类型推导支持