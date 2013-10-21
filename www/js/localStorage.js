function LocalStorage() {
    this.name = '';
    this.pass = '';
    this.checked = false;
    this.save = save;
    this.get = get;
    this.get();

    function save(name, pass,checked) {
        window.localStorage.setItem('name', name);
        window.localStorage.setItem('pass', pass);
        window.localStorage.setItem('checked', checked);
    }
    function get() {
        this.name = window.localStorage.getItem('name') || '';
        this.pass = window.localStorage.getItem('pass') || '';
        this.checked = window.localStorage.getItem('checked') || false;
    }

}