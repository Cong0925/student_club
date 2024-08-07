<template>
  <div class="tinymce-editor">
    <editor v-model="myValue" :init="init" :disabled="disabled" :placeholder="placeholderHtml" @onClick="onClick" />
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme.min.js'
import 'tinymce/icons/default/icons' // 解决了icons.js 报错Unexpected token '<'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/link'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/searchreplace'
import 'tinymce/skins/ui/oxide/skin.min.css'
let that
export default {
    components: {
        Editor
    },
    props: {
    // 传入一个value，使组件支持v-model绑定
        value: {
            type: String,
            default: ''
        },
        // eslint-disable-next-line vue/require-prop-types
        placeholderText: {
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        plugins: {

            type: [String, Array],
            default: 'link lists image media paste table colorpicker textcolor contextmenu fullscreen preview searchreplace'
        },
        toolbar: {
            type: [String, Array],
            default:
        'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
        }
    },
    data() {
        return {
            // 初始化配置
            init: {
                language_url: '/tinymce/langs/zh_CN.js',
                language: 'zh_CN',
                skin_url: '/tinymce/skins/ui/oxide',
                content_css: '/tinymce/skins/content/default/content.css',
                height: 500,
                width:1000,
                plugins: this.plugins,
                toolbar: this.toolbar,
                branding: false,
                menubar: false,
                // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
                // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
                images_upload_handler: (blobInfo, success, failure) => {
                    const img = 'data:image/jpeg;base64,' + blobInfo.base64()
                    success(img)
                }
            },
            myValue: this.value,
            placeholderHtml: this.placeholderText,
            setup: function(editor) {
                editor.on('input change undo redo execCommand KeyUp', function() {
                    if (editor.getContent()) {
                        tinymce.DOM.setStyle(that.el, 'display', 'none')
                    }
                })
            }
        }
    },
    watch: {
        value(newValue) {
            this.myValue = newValue
        },
        myValue(newValue) {
            this.$emit('input', newValue)
        }
    },
    mounted() {
        that = this
        that.initTinymcePlaceholder()
    // tinymce.init({})
    },
    methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
        onClick(e) {
            this.$emit('onClick', e, tinymce)
        },
        // 可以添加一些自己的自定义事件，如清空内容
        clear() {
            this.myValue = ''
        },
        // 初始化富文本框初始化富文本框Placeholder
        initTinymcePlaceholder() {
            tinymce.PluginManager.add('placeholder', function(editor) {
                editor.on('init', function() {
                    const label = new Label()

                    onBlur()

                    tinymce.DOM.bind(label.el, 'click', onFocus)
                    editor.on('focus', onFocus)
                    editor.on('blur', onBlur)
                    editor.on('change', onBlur)
                    editor.on('setContent', onBlur)
                    editor.on('keydown', onKeydown)

                    function onFocus() {
                        if (!editor.settings.readonly === true) {
                            label.hide()
                        }
                        editor.execCommand('mceFocus', false)
                    }

                    function onBlur() {
                        if (editor.getContent() === '') {
                            label.show()
                        } else {
                            label.hide()
                        }
                    }

                    function onKeydown() {
                        label.hide()
                    }
                })

                const Label = function() {
                    const placeholderText =
            editor.getElement().getAttribute('placeholder') ||
            editor.settings.placeholder
                    const placeholderAttrs = editor.settings.placeholder_attrs || {
                        style: {
                            position: 'absolute',
                            top: '5px',
                            left: 0,
                            color: '#888',
                            padding: '1%',
                            width: '98%',
                            overflow: 'hidden',
                            'white-space': 'pre-wrap'
                        }
                    }
                    const contentAreaContainer = editor.getContentAreaContainer()

                    tinymce.DOM.setStyle(contentAreaContainer, 'position', 'relative')

                    // Create label el
                    this.el = tinymce.DOM.add(
                        contentAreaContainer,
                        editor.settings.placeholder_tag || 'label',
                        placeholderAttrs,
                        placeholderText
                    )
                }

                Label.prototype.hide = function() {
                    tinymce.DOM.setStyle(this.el, 'display', 'none')
                }

                Label.prototype.show = function() {
                    tinymce.DOM.setStyle(this.el, 'display', '')
                }
            })
        }
    }
}
</script>
<style scoped>
</style>
