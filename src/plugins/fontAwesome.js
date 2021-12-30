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
  faSmileBeam,
  faMeh,
  faMehRollingEyes,
  faSadCry
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUser, faKey, faPowerOff, faArrowLeft, faArrowRight, faArrowUp, faArrowDown, faExclamationTriangle)
library.add(faWifi, faSyncAlt, faMapPin, faSlidersH, faBurn, faHandPaper, faExternalLinkAlt, faCommentDollar)
library.add(faDizzy, faCaretDown, faCaretUp, faMoon, faSun, faBars, faBug, faGrinStars, faSmileBeam)
library.add(faMeh, faMehRollingEyes, faSadCry)

Vue.component('fa-icon', FontAwesomeIcon)
