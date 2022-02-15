<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view />
  </div>
</template>

<style lang="scss">

* {
  margin: 0;
  padding: 0;
}
body,
#app {
  font-family: PingFang SC, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  max-width: 14.81rem;
  margin: auto;
  box-shadow: 0 0 15px #ccc;
}
a {
  color: #333;
  text-decoration: none;
}
body,
html {
  margin: 0 auto !important;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  overflow: hidden;
}
::-webkit-scrollbar {
  display: none !important;
}
input:focus {
  outline: none;
}
input[type="number"],
input[type="text"],
input[type="button"],
input[type="submit"],
input[type="reset"] {
  -webkit-appearance: none;
}
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
#gameChatIcon {
  right: unset !important;
  left: 10px !important;
}
@media screen and (min-width: 799px) {
  #gameChatIcon {
    margin-left: 0 !important;
  }
}
</style>
