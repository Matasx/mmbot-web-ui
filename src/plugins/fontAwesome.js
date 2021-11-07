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
  faCommentDollar
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUser, faKey, faPowerOff, faArrowLeft, faArrowRight, faArrowUp, faArrowDown, faExclamationTriangle)
library.add(faWifi, faSyncAlt, faMapPin, faSlidersH, faBurn, faHandPaper, faExternalLinkAlt, faCommentDollar)

Vue.component('fa-icon', FontAwesomeIcon)
