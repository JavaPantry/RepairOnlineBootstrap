var tceppsInvocationError = false;

function getCreditCardForm(
    tcepps
) {
    addTceppsActionApp(tcepps);

    var form =
            generateTceppsProxyForm(
                tcepps.action
                ,	tcepps.target
                ,	tcepps.method
            )
        ;
    appendHiddenInputs(form, tcepps);

    submitTceppsProxyForm(form, false);
}


function invokeTceppsProxy(
    tceppsProxy
) {

    addTceppsActionApp(tceppsProxy);

    var form =
            generateTceppsProxyForm(
                tceppsProxy.action
                ,	"tceppsProxyIFrame"
                ,	"post"
            )
        ;

    appendHiddenInputs(form, tceppsProxy);

    submitTceppsProxyForm(form, false);
}

function addTceppsActionApp(tcepps) {
    if (tcepps.app) {
        addTceppsActionParameter(tcepps, "tceppsApp", tcepps.app.value);
    }
}

function addTceppsActionParameter(tcepps, parameterName, parameterValue) {
    if (tcepps.action.indexOf(parameterName + "=") < 0) {
        if (tcepps.action.indexOf("?") < 0) {
            tcepps.action += "?";
        } else {
            tcepps.action += "&";
        }
        tcepps.action += (parameterName + "=" + parameterValue);
    }
}

function submitCreditCardForm(queryString) {
    this.tceppsInvocationError = false;
    if (queryString.length > 0) {
        var parameters = parseQueryString(queryString);
        if (top.creditCardFormIFrame.invokeTceppsServiceOperation) {
            top.creditCardFormIFrame.invokeTceppsServiceOperation(parameters);
        }
    }
}


function invokeTceppsResponseError(tcepps, errorMessage) {
    var form =
            generateTceppsProxyForm(
                tcepps.proxyUrl.value + "?status=ERROR&errorMessage=" + errorMessage
                ,	"tceppsProxyIFrame"
                ,	"post"
            )
        ;
    submitTceppsProxyForm(form, false);
}


function runTransaction_profileAdd(
    tcepps
    ,	cs
    ,	ppa
) {
    var form = getTceppsProxyForm(tcepps);

    appendHiddenInputs(form, tcepps);
    appendHiddenInputs(form, cs);
    appendHiddenInputs(form, ppa);

    submitTceppsProxyForm(form, true);
}


function runTransaction_newOrder(
    tcepps
    ,	cs
    ,	pno
) {
    var form = getTceppsProxyForm(tcepps);

    appendHiddenInputs(form, tcepps);
    appendHiddenInputs(form, cs);
    appendHiddenInputs(form, pno);

    submitTceppsProxyForm(form, true);
}


function runTransaction(
    tcepps
    ,	cs
) {
    var form = getTceppsProxyForm(tcepps);

    appendHiddenInputs(form, tcepps);
    appendHiddenInputs(form, cs);

    submitTceppsProxyForm(form, true);
}


function profileAdd(
    tcepps
    ,	ppa
) {
    var form = getTceppsProxyForm(tcepps);

    appendHiddenInputs(form, tcepps);
    appendHiddenInputs(form, ppa);

    submitTceppsProxyForm(form, true);
}

function validationError(
    tcepps
    ,	errorMessage
) {
    tcepps.action = tcepps.action + "&app.errorMessage=" + errorMessage;
    tcepps.serviceOperation.value = "validationError";

    var form = getTceppsProxyForm(tcepps);

    appendHiddenInputs(form, tcepps);

    submitTceppsProxyForm(form, true);
}

function cancel(
    tcepps
) {
    tcepps.serviceOperation.value = "cancel";

    var form = getTceppsProxyForm(tcepps);

    appendHiddenInputs(form, tcepps);

    submitTceppsProxyForm(form, true);
}


function newOrder(
    tcepps
    ,	pno
) {
    var form = getTceppsProxyForm(tcepps);

    appendHiddenInputs(form, tcepps);
    appendHiddenInputs(form, pno);

    submitTceppsProxyForm(form, true);
}


function newOrder_runTransaction(
    tcepps
    ,	pno
    ,	cs
) {
    var form = getTceppsProxyForm(tcepps);

    appendHiddenInputs(form, tcepps);
    appendHiddenInputs(form, pno);
    appendHiddenInputs(form, cs);

    submitTceppsProxyForm(form, true);
}

function getTceppsProxyForm(
    tcepps
) {

    addTceppsActionApp(tcepps);

    var form = generateTceppsProxyForm(
        tcepps.action
        , 	"tceppsProxyIFrame"
        ,	"post"
    );

    appendHiddenInput(form, "tcepps.app"					, tcepps.app.value);
    appendHiddenInput(form, "tcepps.token"					, tcepps.token.value);
    appendHiddenInput(form, "tcepps.sign"					, tcepps.sign.value);
    appendHiddenInput(form, "tcepps.serviceOperation"		, tcepps.serviceOperation.value);

    return form;
}

function generateTceppsProxyForm(
    action
    ,	target
    ,	method
){
    generateTceppsProxyIFrame();

    var form = document.createElement("form");
    form.action = action;
    form.target = target;
    form.method = method;

    return form;
}

function generateTceppsProxyIFrame() {
    var tceppsProxyIFrame = document.createElement("iframe");
    document.body.appendChild(tceppsProxyIFrame);
    tceppsProxyIFrame.id 					= "tceppsProxyIFrame";
    tceppsProxyIFrame.name 					= "tceppsProxyIFrame";
    tceppsProxyIFrame.width					= 10;
    tceppsProxyIFrame.height				= 10;
    tceppsProxyIFrame.contentWindow.name 	= "tceppsProxyIFrame";
    tceppsProxyIFrame.style.display 		= "none";
    addOnLoadEventListener(tceppsProxyIFrame);
    return tceppsProxyIFrame;
}

function addOnLoadEventListener(tceppsProxyIFrame) {
    if (tceppsProxyIFrame.addEventListener) {
        tceppsProxyIFrame.addEventListener("load", tceppsProxyIFrameOnLoad(), true);
    } else {
        tceppsProxyIFrame.attachEvent("onload", tceppsProxyIFrameOnLoad);
    }
}

function tceppsProxyIFrameOnLoad() {
    //document.body.removeChild(document.getElementById("tceppsProxyIFrame"));
    setTimeout(checkTceppsInvocationError, 500);
}

function checkTceppsInvocationError() {
    if (this.tceppsInvocationError) {
        if (this.tceppsResponseError) {
            this.tceppsResponseError("Failed to invoke TCEPPS Service.");
        } else {
            alert("Failed to invoke TCEPPS Service.");
        }
    }
}


function appendHiddenInputs(targetForm, sourceForm) {
    for (var i = 0; i < sourceForm.elements.length; i++) {
        var sourceFormElement = sourceForm.elements[i];
        appendHiddenInput(targetForm, sourceForm.name + "." + sourceFormElement.name, sourceFormElement.value);
    }
}

function appendHiddenInput(form, name, value) {
    var hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = name;
    hiddenInput.value = value;
    form.appendChild(hiddenInput);
}


function submitTceppsProxyForm(tceppsProxyForm, checkInvocationError) {
    this.tceppsInvocationError = checkInvocationError;
    document.body.appendChild(tceppsProxyForm);
    tceppsProxyForm.submit();
    document.body.removeChild(tceppsProxyForm);
}

function tceppsResponse(queryString) {
    top.tceppsInvocationError = false;
    if (queryString.length > 0) {
        var parameters = parseQueryString(queryString);
        var status = parameters["status"];
        if (status) {
            if (status == "SUCCESS") {
                top.tceppsResponseSuccess(parameters);
            } else {
                top.tceppsResponseError(decodeURIComponent(parameters["exceptionClass"] + " : " + parameters["errorMessage"]));
            }
        }
    }
    top.document.body.removeChild(top.document.getElementById("tceppsProxyIFrame"));
}


function parseQueryString(queryString) {
    var parameters = new Array();
    var nameValues = decodeURI(queryString).split(/&/);
    for (var i in nameValues) {
        var nameValue = nameValues[i].split(/=/);
        parameters[nameValue[0]] = nameValue[1];
    }
    return parameters;
}


function getParentUrl() {
    var url = window.location.href;
    return url.substr(0, url.lastIndexOf("/") + 1);
}