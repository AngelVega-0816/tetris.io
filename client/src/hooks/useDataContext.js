const { useContext } = require("react");
const { default: Context } = require("../context/context");

export let UseDataContext = () => useContext(Context)