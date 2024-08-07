import { permission } from '@/utils/permission'

export default {
    mounted(el, binding) {
        const { value } = binding
        Array.isArray(value) && value.some(permission) && el.parentNode.removeChild(el)
    }
}
