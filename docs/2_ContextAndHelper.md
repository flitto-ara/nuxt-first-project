# Context and helpers
## Context

context 객체는 asyncData , plugins , middleware, nuxtServerInit과 같은 특별한 넉스트 함수에서 사용가능하다.
현재 리퀘스트에 대한 부가적이고, 옵셔널한 정보를 제공한다.
![](https://nuxtjs.org/_nuxt/image/c12c33.svg)

우선, 컨텍스트는 넉스트 앱의 다른 부분들에 대한 접근을 제공하기 위해 사용된다.
(vuex store, connect instance 등)
그러므로 우리는 서버사이드 렌더링에서 사용가능한 컨텍스트 내부의 req, res 객체와
항상 사용가능한 store를 갖고있다.

컨텍스트는 유용한 변수와 숏컷들의 등장으로 확장되었다.
이제 우리는 컨텍스트를 통해 개발 모드에서 환경 변수에 접근할 수 있는 옵션 뿐만 아니라 
HMR 기능, 현재 route, page params 및 query에도 접근할 수 있다.

게다가 모듈 함수들과 헬퍼들을 서버, 클라이언트 사이드 렌더링 모두에서 사용할 수 있도록 컨텍스트를 통해 노출할 수 있다. 
![](https://github.com/flitto-ara/nuxt-first-project/tree/main/docs/image/1.png)

```ts
function (context) { // Could be asyncData, nuxtServerInit, ...
  // Always available
  const {
    app,
    store,
    route,
    params,
    query,
    env,
    isDev,
    isHMR,
    redirect,
    error,
    $config
  } = context

  // Only available on the Server-side
  if (process.server) {
    const { req, res, beforeNuxtRender } = context
  }

  // Only available on the Client-side
  if (process.client) {
    const { from, nuxtState } = context
  }
}
```

## API 쿼리를 위한 page parameters 사용하기
컨텍스트는 context.params를 통해 route의 동적 파라미터들을 직접적(directly)으로 노출시킨다.
예를 들어 URL의 일부로 동적인 페이지 파라미터를 이용하는 nuxt/http 모듈을 거쳐 api를 요청하면
 모듈들은(like nuxt/httl) context.app object를 통해 사용사능한 그들의 함수를 노출시킬 수 있다.
 
#### context.error
또한 잠재적인 에러를 다루기 위해 우리는 try/catch로 API call을 감싼다.
context.error 함수로 우리는 즉시 넉스트의 에러 페이지를 보여줄 수 있다.

```ts
export default {
  async asyncData(context) {
    const id = context.params.id
    try {
      // Using the nuxtjs/http module here exposed via context.app
      const post = await context.app.$http.$get(
        `https://api.nuxtjs.dev/posts/${id}`
      )
      return { post }
    } catch (e) {
      context.error(e) // Show the nuxt error page with the thrown error
    }
  }
```


### Redirecting users & accessing the store
Vuex store에 접근하는 것도 컨텍스트를 통해 가능하다.
컨텍스트는 뷰 컴포넌트 내부에서 this.$store로 사용할 수 있는 store 오브젝트를 제공한다.

게다가 컨텍스트를 통해 노출된 헬퍼인 redirect method도 사용할 수 있다.
예를들어 authenticated 상태가 falsy인 경우 메인으로 redirect하기 위해 사용할 수 있따.

```ts 
export default {
  middleware({ store, redirect }) {
    // retrieving keys via object destructuring
    const isAuthenticated = store.state.authenticated
    if (!isAuthenticated) {
      return redirect('/login')
    }
  }
}
```

![](https://github.com/flitto-ara/nuxt-first-project/tree/main/docs/image/2.png)

## Helpers
context shorcuts 뿐만 아니라, helpers 도 있다!

### $nuxt : The Nuxt Helper
$nuxt는 유저 경험을 향상시키고 몇몇의 상황에서 비상탈출(?!)을 하기 위해 디자인된 helper이다.
뷰 컴포넌트 내부에서 this.$nuxt 를 통해 접근할 수 있고, 다른 client side에서는 window.$nuxt로 
접근 가능하다.

#### Connection Checker
빠르게 인터넷 커넥션을 체크할 수 있다. 
boolen 값을 갖는 isOffline, isOnline를 노출시킨다. 
이를 이용해서 user가 offline이 되자마자 message를 보여줄 수 있다.


```ts
<template>
  <div>
    <div v-if="$nuxt.isOffline">You are offline</div>
    <Nuxt />
  </div>
</template>
```

#### Accessing the root instance
DX/UX (Developer Experience / User Experience) 기능들을 제공하는 것에 더해
$nuxt 헬퍼는 모든 뷰 컴포넌트(from)에서 root instance(to)로의 shortcut을 제공한다.

뷰컴포넌트 밖에서 특별한 상황($axios와 같은 module methods에 접근)을 해결하기 위해  window.$nuxt를 통해 root에 접근할 수 있지만 굉장히 조심히 사용하여야 하고,
되도록이면 마지막 수단으로 여기는 것이 좋다.

####@ Refreshing page data
현재 화면을 새로고침할 때, 모든 페이지를 전부 리로드하고 싶지 않을 수 있다.
왜냐하면 서버에 다시 한 번 요청해야하고 적어도 한번은 전체 nuxt application을 다시 초기화해야하기 때문이다.

this.$nuxt.refresh() 헬퍼를 이용하면 (asyncData 또는 fetch 로부터 제공되는) 데이터만 refresh 할 수 있다.

```ts
<template>
  <div>
    <div>{{ content }}</div>
    <button @click="refresh">Refresh</button>
  </div>
</template>

<script>
  export default {
    asyncData() {
      return { content: 'Created at: ' + new Date() }
    },
    methods: {
      refresh() {
        this.$nuxt.refresh()
      }
    }
  }
</script>
```

#### Controlling the loading bar
this.$nuxt.$loading 이용해서 nuxt의 로딩바를 컨트롤할 수 있다.

```
export default {
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      setTimeout(() => this.$nuxt.$loading.finish(), 500)
    })
  }
}
```

#### onNuxtReady helper
넉스트 어플리케이션이 로드되고(loaded), 준비가(ready)가 된 후에 어떤 스크립트를 실행하고 싶다면, window.onNuxtReady 함수를 사용하면 된다.
이는 클라이언트 사이드에서 인터랙티브 시간을 증가시키지 않고 함수를 실행하고 싶을 때 유용하다.

```ts
window.onNuxtReady(() => {
  console.log('Nuxt is ready and mounted')
})
```

#### Process helpers
넉스트는 세가지 boolean 값을 글로벌 process 객체에 주입한다.
process 객체는 static site generation을 체크하고, 앱이 server 또는 완전히 client에서 렌더되었는지 알려준다.
이 헬퍼들은 application에서 전반적으로 사용가능하고 일반적으로 asyncData에서 사용한다.

```ts
<template>
  <h1>I am rendered on the {{ renderedOn }} side</h1>
</template>

<script>
  export default {
    asyncData() {
      return { renderedOn: process.client ? 'client' : 'server' }
    }
  }
</script>
```
위 예제에서는 서버사이드 렌더링일 때, renderedOn이 'server'값을 갖고, 유저는 페이지에 바로(directly) 접근할 수 있다.
유저가 어플리커이션의 다른 곳에서 부터 해당 페이지에 접근하려고 하면( e.g. by click on a <NuxtLink>, ), 'client'값을 갖게된다

