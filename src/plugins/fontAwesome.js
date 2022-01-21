import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUser,
  faKey,
  faPowerOff,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faArrowDown,
  faExclamationTriangle,
  faWifi,
  faSyncAlt,
  faMapPin,
  faSlidersH,
  faBurn,
  faHandPaper,
  faExternalLinkAlt,
  faCommentDollar,
  faDizzy,
  faCaretDown,
  faCaretUp,
  faMoon,
  faSun,
  faBars,
  faBug,
  faGrinStars,
  faGrinBeam,
  faMeh,
  faFrownOpen,
  faSadCry,
  faVial
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUser, faKey, faPowerOff, faArrowLeft, faArrowRight, faArrowUp, faArrowDown, faExclamationTriangle)
library.add(faWifi, faSyncAlt, faMapPin, faSlidersH, faBurn, faHandPaper, faExternalLinkAlt, faCommentDollar)
library.add(faDizzy, faCaretDown, faCaretUp, faMoon, faSun, faBars, faBug, faGrinStars, faGrinBeam)
library.add(faMeh, faFrownOpen, faSadCry, faVial)

Vue.component('fa-icon', FontAwesomeIcon)
