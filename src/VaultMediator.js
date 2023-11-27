export default class VaultMediator {
  constructor(vaultComponent) {
    this.vaultComponent = vaultComponent
  }

  openForm(formType) {
    this.vaultComponent.selectedType = formType
    this.vaultComponent.openModal("Add New " + formType)
  }

  // Add other methods to handle different interactions
}
