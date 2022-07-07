# Server side Rendering(SSR)
SSR은 브라우저에서 렌더링하는 대신 서버에서 디스플레이할 수 있도록 하는 application ablity이다.
서버 사이드는 완전히 렌더된 페이지를 client에게 보내고, 
클라이언트의 자바스크립트 번들은 그것을 인수하여 Vue.js 앱이 hydrate 할 수 있게 해준다. 

?
서버가 정적 파일을 만들어서 Vue에게 인계함
-> 데이터 변경에 반응할 수 있는 **동적 DOM으로 변환**함 (client에서 일어남)

> Hydration은 Vue가 서버에서 보낸 정적 HTML을 인계 받아 클라이언트 측 데이터 변경에 반응 할 수있는 동적 DOM으로 변환하는 클라이언트 측 프로세스를 의미합니다.
> https://runebook.dev/ko/docs/vue/guide/ssr/hydration


### Node.js
웹페이지를 렌더하기 위해 자바스크립트 환경이 필요하다.
Node.js서버는 Vue.js application을 실행하기 위한 설정을 갖추어야한다.

### 서버 확장(extends),  컨트롤 
#### serverMiddleware
serverMiddleware를 이용해 서버를 확장할 수 있다.

```ts
export default {
serverMiddleware: ['~/server-middleware/logger']

}
```

#### middleware
미들웨어를 통해 routes를 컨트롤할 수 있다.
```ts
// server-middleware/logger.js
export default function (req, res, next) {
  console.log(req.url)
  next()
}
```
![](https://github.com/flitto-ara/nuxt-first-project/tree/main/docs/image/스크린샷 2022-07-07 오후 6.30.32.png)

### 서버 vs 브라우저 환경
노드를 사용하기때문에 노드 오브젝트들에게 접근할 수 있다. (ex. req, res)
하지만 브라우저 환경의 window나 document에는 접근할 수 없다.
하지만, beforeMount나 mounted 훅을 이용해서 이들에게 접근이 가능하다.

```ts
beforeMount () {
  window.alert('hello');
}
mounted () {
  window.alert('hello');
}
```


### Nuxt를 통한 서버사이드렌더링
#### 1단계: Browser to Server
브라우저가 첫 리퀘스트를 보내면, 노드 내부서버를 hit한다.
넉스트는 HTML을 생성하고 실행한 함수(e.g asyncData,nuxtServerInit, fetch)의 결과값과 함께 이를 브라우저에게 보내준다. 
Hooks 함수들도 실행된다.

#### 2단계: Server to Browser
브라우저는 렌더된 페이지를 받는다. 콘텐트들은 디스플레이 되어지고, 반응형으로 동작하게 해 줄 Vue.js hydration이 시작된다.
모든 과정이 끝나면, 페이지는 반응형이 된다.

#### 3단계: Browser to Browser
페이지들 사이를 <NuxtLink>를 이용해 이동하는 것은 클라이언트 사이드에서 이루어진다.
따라서 hard refresh(like F5, cmd+r)를 하지 않는 한, 서버를 다시 호출하지 않는다. 

## caveat [주의]
caveat: (특정 절차를 따르라는) 통고[경고]

### window or document는 undefined
서버사이드 렌더링이기 때문에 이들은 undefined이다.
만약에 오직 clioent-side에서만 resource를 import 할 것을 구체적으로 명시하고 싶다면,
**process.client**을 사용하면 된다.

```ts
// in .vue file
if (process.client) {
  require('external_library')
}
```

### iOS and phone numbers
일부 모바일 사파리 버전은 자동으로 폰넘버를 링크로 변환한다.
이것은 NodeMismatch warning을 발생시킨다. (SSR 컨텐트가 더이상 웹사이트 컨텐트와 매치되지 않기때문에)
이것은 해당 사파리 버전에서 앱을 사용할 수 없게 만든다.
만약에 넉스트페이지에 전화번호가 포함되어 있다면, 두가지 옵션이 있다.

#### meta tag
폰넘버 -> 링크 변환을 막는다.
```ts
<meta name="format-detection" content="telephone=no" />
```

#### 폰넘버를 links로 Wrap!
```ts
<!-- Example phone number: +7 (982) 536-50-77 -->

<template>
  <a href="tel: +7 (982) 536-50-77">+7 (982) 536-50-77</a>
</template>
```


