export default {
  methods: {
    getColorPrioridad(prioridad) {
      switch (prioridad) {
        case 1:
          return "#F0666B"
        case 2:
          return "#E5766B"
        case 3:
          return "#DB866C"
        case 4:
          return "#D1976D"
        case 5:
          return "#C7A76D"
        case 6:
          return "#BCB76E"
        case 7:
          return "#B2C86F"
        case 8:
          return "#A8D86F"
        case 9:
          return "#9EE870"
        default:
          return "#94F971"
      }
    },
  },
}
