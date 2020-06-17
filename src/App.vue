<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  created () {
    const currentPath = this.$router.history.current.path

    if (window.localStorage.getItem('authenticated') === 'false') {
      this.$router.push('/login')
    }

    // if (currentPath === '/' || currentPath === '/app') {
    //   this.$router.push('/')
    // }
  },
}
</script>
