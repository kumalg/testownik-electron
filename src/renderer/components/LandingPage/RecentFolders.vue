<template>
<div class="recent-folders">
  <div class="recent-folders-container">
    <h3>Ostatnio używane</h3>
    <ul>
      <li v-for="folder in recentFolders" :key="folder" :title="folder" @click="$emit('FolderClick', folder)">
        <i @click.stop="$store.dispatch('deleteRecentFolder', folder)" title="">
          <FontAwesomeIcon :icon="faTrashAlt"/>
        </i>
        <p>{{ folder }}</p>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faTrashAlt } from '@fortawesome/fontawesome-free-regular'

export default {
  props: {
    recentFolders: {
      type: Array
    }
  },
  components: {
    FontAwesomeIcon
  },
  data () {
    return {
      faTrashAlt
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/_colors.scss';

.recent-folders {
  width: 300px;
  background: var(--sidebar-background);
  transition: background .2s ease;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  .recent-folders-container {
    margin-top: 48px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    h3 {
      text-align: right;
      margin-bottom: 24px;
      margin-right: 24px;
      color: var(--secondary-text);
      font-weight: 400;
    }

    ul {
      width: 100%;
      list-style: none;
      padding: 0;
      overflow: auto;
      li {
        padding: 16px 24px;
        display: flex;
        flex-wrap: nowrap;
        cursor: pointer;
        transition: background .2s ease;
        font-size: 0.875em;
        &:hover {
          background: rgba(var(--max-color), .25);
          i {
            opacity: 1;
          }
        }
        p {
          flex: 1;
          text-align: right;
          overflow: hidden;
          direction: rtl;
          text-overflow: ellipsis;
          color: var(--primary-text);
          white-space: nowrap;
        }
        i {
          padding: 8px;
          margin: -8px;
          margin-right: 0;
          transition: color .2s ease, opacity .2s ease;
          color: var(--secondary-text);
          opacity: 0;
          &:hover {
            color: var(--red-color);
          }
        }
      }
    }
  }
}
</style>
