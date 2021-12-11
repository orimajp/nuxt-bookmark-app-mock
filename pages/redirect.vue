<script lang="ts">
import {defineComponent, useRoute, useRouter} from "@nuxtjs/composition-api";

export default defineComponent({
  layout: 'plain',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const param = route.value.query.p
    if (!param) {
      return router.replace('/')
    }
    router.replace(param as string)
  }
})
</script>
