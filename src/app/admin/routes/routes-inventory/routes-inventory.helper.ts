class RenameRouteBatch {
  routesList: Array<any>
  renamedBatches = []
  sameRoute = []
  newCharArray = []
  batchLetter: string
  lastRouteName: string
  lastBatchLetter: string

  constructor(
    routes: Array<any>,
    lastRouteName: string,
    lastBatchLetter: string
  ) {
    this.routesList = [...routes]
    this.lastRouteName = lastRouteName
    this.lastBatchLetter = lastBatchLetter
  }

  nextLetter(letter) {
    return letter === 'Z' ? 'A' : String.fromCharCode(letter.charCodeAt(0) + 1);
  }

  incrementChar(batchString) {
    const lastChar = batchString[batchString.length - 1]
    const remString = batchString.slice(0, batchString.length - 1)
    const newChar = lastChar === undefined ? 'A' : this.nextLetter(lastChar);
    this.newCharArray.unshift(newChar)
    if (lastChar === 'Z') {
      return this.incrementChar(remString)
    }
    const newBatchString = remString + [...this.newCharArray].join('')
    this.newCharArray = []
    return newBatchString;
  }

  updateBatches() {
    this.batchLetter = this.sameRoute[0].name === this.lastRouteName ? this.lastBatchLetter : 'A';
    for (let k = 0; k < this.sameRoute.length; k++) {
      this.sameRoute[k].batch = this.batchLetter;
      this.batchLetter = this.incrementChar(this.batchLetter);
    }
    this.renamedBatches.push(...this.sameRoute);
    this.sameRoute = [];
  }

  renameRouteBatches() {
    while (this.routesList.length > 0) {
      this.sameRoute.push(this.routesList.shift());
      if (this.routesList.length === 0) {
        this.updateBatches();
        this.lastBatchLetter = this.batchLetter;
        this.lastRouteName = this.renamedBatches[this.renamedBatches.length - 1].name
        return this.renamedBatches;
      }
      if (this.sameRoute[0].name !== this.routesList[0].name) {
        this.updateBatches();
      }
    }
  }
}

export default RenameRouteBatch;
