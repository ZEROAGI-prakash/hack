import { Controller } from "@hotwired/stimulus"

// Show/hide elements based on the value of a select element.
//
// Example:
//    <div data-controller="select-definitions">
//      <select
//        data-select-definitions-target="select"
//        data-action="change->select-definitions#change"
//      >
//        <option
//          selected
//          data-select-definitions-unhandled
//        >
//         Select a dinosaur
//        </option>
//        <option value="apatosaurus">Apatosaurus</option>
//        <option value="diplodocus">Diplodocus</option>
//      </select>
//      <div data-select-definitions-target="message" hidden>
//        You chose:
//        <div
//          data-select-definitions-target="definition"
//          data-select-definitions-value="apatosaurus"
//        >
//          The dinosaur formerly known as Brontosaurus.
//        </div>
//        <div
//          data-select-definitions-target="definition"
//          data-select-definitions-value="diplodocus"
//        >
//          Thin at one end, much thicker in the middle, and thin again at the end.
//        </div>
//      </div>
//    </div>

export default class extends Controller {
  static targets = ["definition", "message", "select"]

  connect() {
    this.change()
  }

  change() {
    // Select the definitions whose values match the chosen value.
    this.definitionTargets.forEach(definition => {
      definition.hidden =
        definition.dataset.selectDefinitionsValue != this.selectTarget.value
    })

    // Hide the message if the selected option disables it.
    if (this.hasMessageTarget) {
      for (const option of this.selectTarget.selectedOptions) {
        this.messageTarget.hidden =
          option.value == "" || option.dataset.selectDefinitionsUnhandled
      }
    }
  }
}
