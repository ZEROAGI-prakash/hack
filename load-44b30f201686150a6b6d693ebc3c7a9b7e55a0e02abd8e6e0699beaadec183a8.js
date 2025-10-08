import { isSafari } from "helpers/browsers"

// Bust out of frames
if (window.top.location != window.location) {
  window.top.location = window.location
}

// Remove "#_=_" in the URL that Facebook auth adds
// http://stackoverflow.com/a/18305085
if (window.location.hash == "#_=_") {
  if (history.replaceState) {
    history.replaceState(null, null, window.location.href.split("#")[0])
  } else {
    window.location.hash = ""
  }
}

// Add classes to the body
document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("with-js")

  if (!("open" in document.createElement("details"))) {
    document.documentElement.classList.add("no-details")
  }

  if (isSafari()) document.documentElement.classList.add("is-safari")
})

// Update locale on the html on page change
document.addEventListener("turbo:load", function () {
  var lang = document.querySelector("meta[name=language]").content
  document.documentElement.lang = lang
})

// Welcome message
if (document.documentElement.classList.contains("cults")) {
  console.info(
    `%c
                         ........
                    .:t.sssssssssstl.
                 .l.sss.tl:::::lt.ssssl.
                lsss.:.            .tssst.
              ..sst.                 .tsss:
             .sssl                     .sss:
             sssl                       .sss.
            lsssltt.....tl:.             tsst
           ..sssss..tt..ssssl            :sss.
         ..ssst:.        .ssl            :ssss.:
       .tss.:            .lsl            .ss..ss..
      .sssl                             lsss. lsss:
     .sssl                            lsss.   .sss.
     tss.                        .ltl:.ss..     lss.
     sss:             ..l        :tssss.:       .sss.
     sss.           :tsss           .l:          sss.
     .ssl          .ssst.                       .sss
     :sss.          .sst                        .sst
      tss..         .sssl                      tss.
       tss.:         ..ss..                  ..ss..
        :.ss.:.        lssst.             .:.sssl
          :.sss.t:.......lssssstl:......:l.sss.l.
            .:t.ssssssssss..tt.ssssssssss.tl.
                ...::::....     ....::::.

Hello there! Looking to help us build Cults? Contact us at
hello@cults3d.com

Keyboard shortcuts:
- L: language switcher
- C: currency switcher
- S: search

Developer keyboard shortcuts:
- T: switch theme temporarily
- G: show grid and breakpoints`,
    "color: #822ef5")
};
