import Typesense from "typesense"
import debounce from "lodash.debounce"

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "suggestions"]
  static values = {
    apiKey: String,
    hosts: Array,
  }

  connect() {
    if (!this.#dataListSupported()) {
      this.inputTarget.removeAttribute("list")
      return
    }

    // Remember what has been typed (to avoid unnecessary queries)
    this.searched = new Set()

    // Remember what has been inserted (to avoid duplicate options)
    this.results = new Set()

    this.typesenseClient = new Typesense.Client({
      nodes: this.hostsValue,
      apiKey: this.apiKeyValue,
      connectionTimeoutSeconds: 2,
    })

    this.search = debounce(this.search, 250).bind(this)
  }

  async search(e) {
    if (!this.#dataListSupported()) return

    const query = e.target.value.trim()
    if (!query) return

    // Already searched? Do nothing.
    if (this.searched.has(query)) return

    // Otherwise, search through Typesense.
    const suggestions = await this.#fetchSuggestions(query)
    this.searched.add(query)
    if (suggestions.length == 0) return

    suggestions.forEach(suggestion => this.results.add(suggestion))
    this.#fillOptions()
  }

  async #fetchSuggestions(query) {
    const collection = this.typesenseClient.collections("creation_queries")
    const result = await collection.documents().search({
      q: query,
      query_by: "q",
      include_fields: "q",
      highlight_fields: "none",
      use_cache: true,
      prioritize_exact_match: false,
      sort_by: "count:desc",
      limit: 20,
    })
    return result.hits.map(hit => hit.document.q)
  }

  async #fillOptions() {
    const fragment = document.createDocumentFragment()

    this.results.forEach(item => {
      const option = document.createElement("option")
      option.value = item
      option.text = item
      fragment.appendChild(option)
    })

    this.suggestionsTarget.replaceChildren(fragment)
  }

  #dataListSupported() {
    // Safari disabled for now since it adds a dropdown
    // icon inputs with a datalist
    return typeof HTMLDataListElement === "function" &&
      !/^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  }
}
