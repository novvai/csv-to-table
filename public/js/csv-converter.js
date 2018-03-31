
class ElementValidator {
    constructor(element) {
        this.element = element;
    }

    validate() {
        if (this.element !== null) {
            return this.element;
        } else {
            throw Error("There is no such element!");
        }
    }
}

class FileValidator {
    constructor() {
        this.passes = true;
    }
    validate(file, ...extensions) {
        this.handleFile(file);

        extensions.map(el => {
            if (el !== this.fileExt) {
                this.passes = false;
            }
        });
    }

    denies() {
        return !this.passes;
    }
    handleFile(file) {
        this.file = file;
        this.fileExt = file.name.split('.').pop();
    }
}

class CSVParser {
    constructor(elementId, tableContainerId) {
        this.fileReader = new FileReader();
        this.element = new ElementValidator(document.getElementById(elementId)).validate();
        this.tableContainer = new ElementValidator(document.getElementById(tableContainerId)).validate();

        this.setupFileReaderHook();
    }

    setupFileReaderHook() {
        this.fileReader.onload = () => {
            this.visualise()
        };
    }

    load() {
        this.element.addEventListener('change', (event) => {
            let file = this.element.files[0];
            let validator = new FileValidator();

            validator.validate(file, 'csv');

            if (validator.denies()) {
                throw Error("Please Select right file extension")
            }

            this.fileReader.readAsText(file);
        })
    }

    visualise() {
        this.rawResult = this.fileReader.result;
        let lines = this.rawResult.trim().split(/\r|\n/);
        lines.map((line) => {
            let row = document.createElement("tr");

            line.split(',').map(entry => {
                let td = document.createElement('td');
                td.innerText = entry;
                row.appendChild(td);
            })

            this.tableContainer.appendChild(row);
        })
    }
}

window.onload = () => {
    let csvInput = new CSVParser('csvFile', 'table');
    csvInput.load()
}