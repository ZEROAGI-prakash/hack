import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["multi-select"]

  multiSelectOutletConnected() {
    // Ugly hack to wait for the outlet to be REALLY connected
    // cf. https://github.com/hotwired/stimulus/issues/618
    setTimeout(() => {
      const parentCategoryId = this.element.value

      this.updateSubCategories({parentCategoryId, clear: false})
    }, 0)
  }

  onCategoryChange(event) {
    const parentCategoryId = event.target.value

    this.updateSubCategories({parentCategoryId})
  }

  updateSubCategories({parentCategoryId, clear = true}) {
    if (parentCategoryId === "") {
      return
    }

    this.multiSelectOutlet.setupTomSelect(
      this.updateSubCategoriesOptions({parentCategoryId, clear}),
    )
    this.multiSelectOutlet.enable()
    this.multiSelectOutletElement.hidden = false
  }

  updateSubCategoriesOptions({parentCategoryId, clear = true}) {
    return (tomSelect) => {
      if (clear) {
        tomSelect.clear()
        tomSelect.sync()
      }

      tomSelect.clearOptions((option) => {
        return option.parentId === parentCategoryId
      })
    }
  }
}
