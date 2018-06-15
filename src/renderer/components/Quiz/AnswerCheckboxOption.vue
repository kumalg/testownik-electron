<template>
  <!-- <span class="mathjax-element">{{ content }}</span> -->
  <span/>
</template>

<script>
import mathjaxHelper from 'mathjax-electron'

export default {
  props: {
    content: String
  },
  mounted () {
    console.log(new Date())
    var mathElements = document.getElementsByClassName('mathjax-element')
    // mathjaxHelper.typesetMath(mathElements)
    Array.prototype.forEach.call(mathElements, element => {
      mathjaxHelper.typesetMath(element)
      // console.log(element)
    })
  }
}
</script>
