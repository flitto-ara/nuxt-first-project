# NuxtJS
## Structure
### Directory
#### Components
뷰 컴포넌트 저장하고 페이지에 임포트할 수 있다.
####  Assets
css, image, font등
#### Static
server root에 다이렉트로 mapped, 이름이 유지되어야하는 파일들을 담고 있다.
(ex. robots.txt, favicon)
#### Pages
    - 뷰와 라우트
#### Store
#### content
write -> fetch -> display?
#### layouts
#### middleware
#### modules
#### plugins
### File
#### Nuxt.config.js
모듈을 추가하거나 기본 세팅을 override하고 싶다면 여기에 적용하자!

# Views
configure 데이터와 특정 route를 위한 views를 소개한다.
![Composition of a View in Nuxt](https://nuxtjs.org/_nuxt/image/f55faf.png)

## Pages
모든 페이지 컴포넌트는 뷰 컴포넌트이다. 하지만 더 쉽게 개발할 수 있도록 해주는 특별한 attributes and functions 가 존재한다.
뷰는 pages 경로에 있는 뷰 컴포넌트를 기반으로 자동으로 routes를 생성한다.

## LayOuts
 look을 바꾸고 싶을때 유용하다. 
예를 들어 사이드 바를 포함하거나, 모바일과 데탑 레이아웃을 구분하고 싶을 때..

default.vue 파일은 특정한 레이아웃이 없을 때 기본으로 갖게되는 템플릿이다.
<Nuxt/>만 포함하고 있는데 이는 page 컴포넌트를 렌더한다.


```ts
// layouts/blog.vue
<template>
  <div>
    <div>My blog navigation bar here</div>
    <Nuxt />
  </div>
</template>
```

```ts
// pages/posts.vue
<template>
  <!-- Your template -->
</template>
<script>
  export default {
    layout: 'blog'
    // page component definitions
  }
</script>
```

page에 layout을 지정하지 않으면 default.vue layout을 사용하게 된다.


### Error Page
- layouts 폴더에 있지만 page 컴포넌트인것에 주의하자.
