
/**
 * Quasar QSplitter component
 * 
 * @see {@link https://v1.quasar-framework.org/vue-components/splitter|Quasar Docs} (Generated link, may not always work)
 */  
export default {
  name: 'QSplitter',
  props: {
    /**
     * Emitted when component's model value changes; Is also used by v-model
     * @param {Number} value New model value (0.0 < x < 100.0) defining the ratio between panes 
     */      
    '@input': function (value) {},
    /**
     * Model of the component defining the split ratio percent (0.0 < x < 100.0) between panes; Either use this property (along with a listener for 'input' event) OR use v-model directive
     * @type {Number}
     */
    value: {
      type: Number,
    },
    /**
     * Allows the splitter to split its two panes horizontally, instead of vertically
     * @type {Boolean}
     */
    horizontal: {
      type: Boolean,
    },
    /**
     * An array of two values representing a ratio of minimum and maximum split area of the two panes (0.0 < x < 100.0)
     * @type {Array}
     */
    limits: {
      type: Array,
    },
    /**
     * Put component in disabled mode
     * @type {Boolean}
     */
    disable: {
      type: Boolean,
    },
    /**
     * Class definitions to be attributed to the 'before' panel
     * @type {Array|String|Object}
     */
    beforeClass: {
      type: [Array,String,Object],
    },
    /**
     * Class definitions to be attributed to the 'after' panel
     * @type {Array|String|Object}
     */
    afterClass: {
      type: [Array,String,Object],
    },
    /**
     * Class definitions to be attributed to the splitter separator
     * @type {Array|String|Object}
     */
    separatorClass: {
      type: [Array,String,Object],
    },
    /**
     * Style definitions to be attributed to the splitter separator
     * @type {Array|String|Object}
     */
    separatorStyle: {
      type: [Array,String,Object],
    },
    /**
     * Applies a default lighter color on the separator; To be used when background is darker; Avoid using when you are overriding through separator-class or separator-style props
     * @type {Boolean}
     */
    dark: {
      type: Boolean,
    }
  }
}
