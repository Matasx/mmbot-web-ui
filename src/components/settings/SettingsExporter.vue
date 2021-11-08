<template>
    <div>
      <b-button v-b-modal.modal-export variant="info" size="sm">Export</b-button>
      <b-button v-b-modal.modal-import variant="danger" size="sm" class="ml-2">Import</b-button>
      <b-modal id="modal-export" hide-footer title="Copy the following value:">
        <b-textarea ref="area" v-model="exportString" @click="$refs.area.select()" readonly rows="10" />
        <b-button class="mt-3" variant="info" block @click="doExport()">Copy to clipboard</b-button>
      </b-modal>
      <b-modal id="modal-import" hide-footer title="Paste the settings value:">
        <b-textarea ref="area" v-model="settingsInput" rows="10" />
        <b-button class="mt-3" variant="danger" block @click="doImport()">Import</b-button>
      </b-modal>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { SETTINGS_DATA_SET } from '@/store/actions/settings'

const { mapGetters, mapMutations } = createNamespacedHelpers('settings')
const passphrase = '123'

function merge (data, newData) {
  Object.keys(newData).forEach(k => {
    if (Object.hasOwn(data, k)) {
      const current = data[k]
      if (typeof current === 'object' && !Array.isArray(current)) {
        // console.log('merge: ' + k)
        merge(current, newData[k])
      } else {
        // console.log('set: ' + k + '=' + newData[k])
        data[k] = newData[k]
      }
    }
  })
}

export default {
  name: 'SettingsExporter',
  data () {
    return {
      settingsInput: ''
    }
  },
  computed: {
    ...mapGetters(['data']),
    exportString () {
      const json = JSON.stringify(this.data)
      const encrypted = this.CryptoJS.AES.encrypt(json, passphrase)
      return encrypted.toString()
    }
  },
  methods: {
    ...mapMutations({
      setData: SETTINGS_DATA_SET
    }),
    doExport () {
      navigator.clipboard.writeText(this.exportString)
      this.$bvModal.hide('modal-export')
      this.$bvToast.toast('Settings were copied to clipboard!', {
        title: 'Export success',
        autoHideDelay: 5000,
        variant: 'success'
      })
    },
    doImport () {
      this.importString(this.settingsInput)
      this.$bvModal.hide('modal-import')
    },
    importString (value) {
      try {
        const decrypted = this.CryptoJS.AES.decrypt(value, passphrase).toString(this.CryptoJS.enc.Utf8)
        const parsed = JSON.parse(decrypted)
        const current = JSON.parse(JSON.stringify(this.data))
        merge(current, parsed)
        console.log(current)
        this.setData(current)

        this.$bvToast.toast('Settings were imported!', {
          title: 'Import success',
          autoHideDelay: 5000,
          variant: 'success'
        })
      } catch (e) {
        this.$bvToast.toast(e.toString(), {
          title: 'Import error',
          autoHideDelay: 5000,
          variant: 'danger'
        })
      }
    }
  }
}
</script>
