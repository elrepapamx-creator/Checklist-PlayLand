/* =========================================================
   PLAYLAND
   CHECKLIST VEHICULAR - NISSAN NP300

   FUNCIONES:
   - Checklist por secciones
   - Bueno / Regular / Malo / N/A
   - Observaciones cuando es Malo
   - Resumen
   - WhatsApp
   - Generación de Excel
   - Nuevo checklist
   - Sin Firebase
   - Sin base de datos
   - Sin localStorage
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const TOTAL_PAGES = 8;

let currentPage = 1;


/* =========================================================
   DATOS DEL CHECKLIST
========================================================= */

const checklistData = {

    motor: {

        title: "Motor",

        items: [

            "Nivel de agua del radiador",

            "Nivel de liquido de frenos",

            "Nivel de agua parabrisas",

            "Nivel de aceite del motor",

            "Nivel de aceite de dirección",

            "Estado de la bateria",

            "Fugas de liquido detectadas"

        ]

    },


    llantas: {

        title: "Interior",

        items: [

            "Estado de tapiceria",

            "Estado de tapetes",

            "Estado de tablero",

            "Estado de palanca de velocidades",

            "Estado de volante",

            "Estado del interior de puertas",

            "Estado de cinturones de seguridad",

            "Control portón azul",

            

        ]

    },


    frenos: {

        title: "Llantas",

        items: [

            "Estado de rines",

            "Estado de llantas delanteras",

            "Estado de llantas traseras",

            

        ]

    },


    direccion: {

        title: "Documentación",

        items: [

            "Tarjeta de circulación",

            "Licencia",

            "Poliza de seguro",

            

        ]

    },


    electrico: {

        title: "Luces",

        items: [

            "Direccionales",

            "Intermitentes",

            "Stop",

            "Reverseros",

            "Faros",

            "Luces altas",

            

        ]

    },


    cabina: {

        title: "Equipo y herramienta",

        items: [

            "Gato",

            "Reflejantes",

            "Dado de seguridad",

            "Tapon de gasolina",

            "Llanta de refacción",

            "Palanca",

            

        ]

    },


 
    }




/* =========================================================
   CONTENEDORES
========================================================= */

const checklistContainers = {

    motor: "checklist-motor",

    llantas: "checklist-llantas",

    frenos: "checklist-frenos",

    direccion: "checklist-direccion",

    electrico: "checklist-electrico",

    cabina: "checklist-cabina",

    

};


/* =========================================================
   ELEMENTOS DEL DOM
========================================================= */

const pages =
    document.querySelectorAll(".page");

const nextBtn =
    document.getElementById("nextBtn");

const prevBtn =
    document.getElementById("prevBtn");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");

const progressPercent =
    document.getElementById("progressPercent");

const errorMessage =
    document.getElementById("errorMessage");

const sendWhatsappBtn =
    document.getElementById("sendWhatsapp");

const downloadExcelBtn =
    document.getElementById("downloadExcel");

const newChecklistBtn =
    document.getElementById("newChecklist");


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setDateTime();

        renderAllChecklists();

        updatePage();

        attachGlobalEvents();

    }
);


/* =========================================================
   FECHA Y HORA
========================================================= */

function setDateTime() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");


    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    document.getElementById(
        "fecha"
    ).value =
        `${year}-${month}-${day}`;


    document.getElementById(
        "hora"
    ).value =
        `${hours}:${minutes}`;

}


/* =========================================================
   CREAR CHECKLIST
========================================================= */

function renderAllChecklists() {

    Object.keys(
        checklistData
    ).forEach(category => {

        const containerId =
            checklistContainers[
                category
            ];


        const container =
            document.getElementById(
                containerId
            );


        if (!container) {
            return;
        }


        container.innerHTML = "";


        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "checklist-container";


        checklistData[
            category
        ].items.forEach(
            (item, index) => {

                const itemId =
                    `${category}-${index}`;


                const checkItem =
                    document.createElement(
                        "div"
                    );


                checkItem.className =
                    "check-item";


                checkItem.innerHTML = `

                    <div class="check-question">

                        ${index + 1}.
                        ${escapeHtml(item)}

                    </div>


                    <div class="status-options">


                        <div class="status-option">

                            <input
                                type="radio"
                                name="${itemId}"
                                id="${itemId}-bueno"
                                value="Bueno"
                            >

                            <label
                                for="${itemId}-bueno"
                            >
                                Bueno
                            </label>

                        </div>


                        <div class="status-option">

                            <input
                                type="radio"
                                name="${itemId}"
                                id="${itemId}-regular"
                                value="Regular"
                            >

                            <label
                                for="${itemId}-regular"
                            >
                                Regular
                            </label>

                        </div>


                        <div class="status-option">

                            <input
                                type="radio"
                                name="${itemId}"
                                id="${itemId}-malo"
                                value="Malo"
                            >

                            <label
                                for="${itemId}-malo"
                            >
                                Malo
                            </label>

                        </div>


                        <div class="status-option">

                            <input
                                type="radio"
                                name="${itemId}"
                                id="${itemId}-na"
                                value="N/A"
                            >

                            <label
                                for="${itemId}-na"
                            >
                                N/A
                            </label>

                        </div>

                    </div>


                    <div
                        class="observation"
                        id="observation-${itemId}"
                    >

                        <label>
                            Observaciones
                        </label>


                        <textarea
                            id="textarea-${itemId}"
                            placeholder="Describe el problema encontrado..."
                        ></textarea>

                    </div>

                `;


                wrapper.appendChild(
                    checkItem
                );

            }
        );


        container.appendChild(
            wrapper
        );

    });


    attachStatusEvents();

}


/* =========================================================
   EVENTOS DE ESTADO
========================================================= */

function attachStatusEvents() {

    const radios =
        document.querySelectorAll(
            '.status-option input[type="radio"]'
        );


    radios.forEach(
        radio => {

            radio.addEventListener(
                "change",
                function () {

                    const itemId =
                        this.name;


                    const observation =
                        document.getElementById(
                            `observation-${itemId}`
                        );


                    const textarea =
                        document.getElementById(
                            `textarea-${itemId}`
                        );


                    if (
                        this.value === "Malo"
                    ) {

                        observation.classList.add(
                            "show"
                        );

                    } else {

                        observation.classList.remove(
                            "show"
                        );

                        textarea.value = "";

                    }

                }
            );

        }
    );

}


/* =========================================================
   SIGUIENTE
========================================================= */

nextBtn.addEventListener(
    "click",
    () => {

        clearError();


        if (
            !validatePage(
                currentPage,
                true
            )
        ) {

            return;

        }


        if (
            currentPage <
            TOTAL_PAGES
        ) {

            currentPage++;


            updatePage();


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }

    }
);


/* =========================================================
   ANTERIOR
========================================================= */

prevBtn.addEventListener(
    "click",
    () => {

        clearError();


        if (
            currentPage > 1
        ) {

            currentPage--;


            updatePage();


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }

    }
);


/* =========================================================
   ACTUALIZAR PÁGINA
========================================================= */

function updatePage() {

    pages.forEach(
        page => {

            const pageNumber =
                Number(
                    page.dataset.page
                );


            page.classList.toggle(
                "active",
                pageNumber === currentPage
            );

        }
    );


    const percentage =
        Math.round(
            (
                currentPage /
                TOTAL_PAGES
            ) * 100
        );


    progressFill.style.width =
        `${percentage}%`;


    progressText.textContent =
        `Paso ${currentPage} de ${TOTAL_PAGES}`;


    progressPercent.textContent =
        `${percentage}%`;


    prevBtn.disabled =
        currentPage === 1;


    if (
        currentPage ===
        TOTAL_PAGES
    ) {

        nextBtn.style.display =
            "none";


        generateSummary();

    } else {

        nextBtn.style.display =
            "inline-flex";

    }

}


/* =========================================================
   VALIDAR PÁGINA
========================================================= */

function validatePage(
    pageNumber,
    showMessage = true
) {

    /* =========================
       PÁGINA 1
    ========================== */

    if (
        pageNumber === 1
    ) {

        const requiredFields = [

            {
                id: "fecha",
                name: "Fecha"
            },

            {
                id: "hora",
                name: "Hora"
            },

            {
                id: "unidad",
                name: "Unidad"
            },

            {
                id: "conductor",
                name: "Conductor"
            },

            {
                id: "kilometraje",
                name: "Kilometraje"
            },

            {
                id: "combustible",
                name: "Nivel de combustible"
            },

            {
                id: "tipoInspeccion",
                name: "Tipo de inspección"
            }

        ];


        for (
            const field
            of requiredFields
        ) {

            const element =
                document.getElementById(
                    field.id
                );


            if (
                !element.value.trim()
            ) {

                if (
                    showMessage
                ) {

                    showError(
                        `Completa el campo: ${field.name}.`
                    );

                }


                element.focus();


                return false;

            }

        }


        return true;

    }


    /* =========================
       PÁGINAS 2 A 9
    ========================== */

    if (
        pageNumber >= 2 &&
        pageNumber <= 9
    ) {

        const page =
            document.querySelector(
                `.page[data-page="${pageNumber}"]`
            );


        if (!page) {
            return true;
        }


        const radios =
            page.querySelectorAll(
                '.status-option input[type="radio"]'
            );


        const names =
            [
                ...new Set(
                    [
                        ...radios
                    ].map(
                        radio =>
                            radio.name
                    )
                )
            ];


        for (
            const name
            of names
        ) {

            const selected =
                page.querySelector(
                    `input[name="${name}"]:checked`
                );


            if (!selected) {

                if (
                    showMessage
                ) {

                    const question =
                        getQuestionFromRadioName(
                            name
                        );


                    showError(
                        `Falta responder: ${question}`
                    );

                }


                return false;

            }


            if (
                selected.value ===
                "Malo"
            ) {

                const textarea =
                    document.getElementById(
                        `textarea-${name}`
                    );


                if (
                    !textarea ||
                    !textarea.value.trim()
                ) {

                    if (
                        showMessage
                    ) {

                        const question =
                            getQuestionFromRadioName(
                                name
                            );


                        showError(
                            `Debes agregar una observación para: ${question}`
                        );

                    }


                    if (textarea) {

                        textarea.focus();

                    }


                    return false;

                }

            }

        }


        return true;

    }


    return true;

}


/* =========================================================
   OBTENER NOMBRE DE PREGUNTA
========================================================= */

function getQuestionFromRadioName(
    name
) {

    const radio =
        document.querySelector(
            `input[name="${name}"]`
        );


    if (!radio) {

        return "este elemento";

    }


    const checkItem =
        radio.closest(
            ".check-item"
        );


    if (!checkItem) {

        return "este elemento";

    }


    const question =
        checkItem.querySelector(
            ".check-question"
        );


    if (!question) {

        return "este elemento";

    }


    return question.textContent
        .replace(
            /^\d+\.\s*/,
            ""
        )
        .trim();

}


/* =========================================================
   RESUMEN
========================================================= */

function generateSummary() {

    const summaryContainer =
        document.getElementById(
            "summaryContainer"
        );


    if (!summaryContainer) {
        return;
    }


    let html = "";


    /* =========================
       DATOS
    ========================== */

    html += `

        <div class="summary-section">

            <div class="summary-header">

                <span>
                    Datos de la unidad
                </span>

            </div>


            <div class="summary-body">

                <div class="summary-data">

                    ${summaryDataItem(
                        "Fecha",
                        getValue("fecha")
                    )}

                    ${summaryDataItem(
                        "Hora",
                        getValue("hora")
                    )}

                    ${summaryDataItem(
                        "Unidad",
                        getValue("unidad")
                    )}

                    ${summaryDataItem(
                        "Conductor",
                        getValue("conductor")
                    )}

                    ${summaryDataItem(
                        "Kilometraje",
                        getValue("kilometraje")
                    )}

                    ${summaryDataItem(
                        "Combustible",
                        getValue("combustible")
                    )}

                    ${summaryDataItem(
                        "Tipo de inspección",
                        getValue("tipoInspeccion")
                    )}

                </div>

            </div>

        </div>

    `;


    /* =========================
       CHECKLIST
    ========================== */

    Object.keys(
        checklistData
    ).forEach(
        category => {

            const data =
                checklistData[
                    category
                ];


            html += `

                <div class="summary-section">

                    <div class="summary-header">

                        <span>

                            ${escapeHtml(
                                data.title
                            )}

                        </span>

                    </div>


                    <div class="summary-body">

            `;


            data.items.forEach(
                (item, index) => {

                    const itemId =
                        `${category}-${index}`;


                    const selected =
                        document.querySelector(
                            `input[name="${itemId}"]:checked`
                        );


                    if (!selected) {
                        return;
                    }


                    let observationHTML =
                        "";


                    if (
                        selected.value ===
                        "Malo"
                    ) {

                        const textarea =
                            document.getElementById(
                                `textarea-${itemId}`
                            );


                        if (
                            textarea &&
                            textarea.value.trim()
                        ) {

                            observationHTML = `

                                <div class="summary-observation">

                                    Observación:
                                    ${escapeHtml(
                                        textarea.value.trim()
                                    )}

                                </div>

                            `;

                        }

                    }


                    html += `

                        <div class="summary-item">

                            <div>

                                <strong>

                                    ${index + 1}.
                                    ${escapeHtml(item)}

                                </strong>


                                ${observationHTML}

                            </div>


                            <div class="summary-status">

                                ${escapeHtml(
                                    selected.value
                                )}

                            </div>

                        </div>

                    `;

                }
            );


            html += `

                    </div>

                </div>

            `;

        }
    );


    summaryContainer.innerHTML =
        html;

}


/* =========================================================
   ELEMENTO DE RESUMEN
========================================================= */

function summaryDataItem(
    label,
    value
) {

    return `

        <div>

            <strong>

                ${escapeHtml(
                    label
                )}

            </strong>


            <span>

                ${escapeHtml(
                    value || "-"
                )}

            </span>

        </div>

    `;

}


/* =========================================================
   OBTENER VALOR
========================================================= */

function getValue(id) {

    const element =
        document.getElementById(
            id
        );


    return element
        ? element.value
        : "";

}


/* =========================================================
   WHATSAPP
========================================================= */

sendWhatsappBtn.addEventListener(
    "click",
    sendToWhatsApp
);


function sendToWhatsApp() {

    clearError();


    /*
       Validar todas las páginas
    */

    for (
        let pageNumber = 1;
        pageNumber <= 9;
        pageNumber++
    ) {

        if (
            !validatePage(
                pageNumber,
                false
            )
        ) {

            currentPage =
                pageNumber;


            updatePage();


            showError(
                "El checklist todavía tiene información pendiente. Completa esta sección antes de enviarlo."
            );


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });


            return;

        }

    }


    const phoneInput =
        document.getElementById(
            "whatsapp"
        );


    let phone =
        phoneInput.value
            .replace(
                /\D/g,
                ""
            );


    if (!phone) {

        showError(
            "Escribe el número de WhatsApp que recibirá el checklist."
        );


        phoneInput.focus();


        return;

    }


    /*
       México
    */

    if (
        phone.length === 10
    ) {

        phone =
            "52" +
            phone;

    }


    if (
        phone.length < 12
    ) {

        showError(
            "Verifica el número de WhatsApp. En México normalmente son 10 dígitos."
        );


        phoneInput.focus();


        return;

    }


    const message =
        buildWhatsAppMessage();


    const url =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   MENSAJE WHATSAPP
========================================================= */

function buildWhatsAppMessage() {

    let message = "";


    message +=
        "CHECKLIST VEHICULAR - PLAYLAND\n";


    message +=
        "NISSAN NP300 DE REDILAS\n";


    message +=
        "================================\n\n";


    message +=
        "DATOS DE LA UNIDAD\n";


    message +=
        `Fecha: ${getValue("fecha")}\n`;


    message +=
        `Hora: ${getValue("hora")}\n`;


    message +=
        `Unidad: ${getValue("unidad")}\n`;


    message +=
        `Conductor: ${getValue("conductor")}\n`;


    message +=
        `Kilometraje: ${getValue("kilometraje")}\n`;


    message +=
        `Combustible: ${getValue("combustible")}\n`;


    message +=
        `Tipo de inspección: ${getValue("tipoInspeccion")}\n\n`;


    Object.keys(
        checklistData
    ).forEach(
        category => {

            const data =
                checklistData[
                    category
                ];


            message +=
                `${data.title.toUpperCase()}\n`;


            message +=
                "--------------------------------\n";


            data.items.forEach(
                (item, index) => {

                    const itemId =
                        `${category}-${index}`;


                    const selected =
                        document.querySelector(
                            `input[name="${itemId}"]:checked`
                        );


                    if (!selected) {
                        return;
                    }


                    message +=
                        `${index + 1}. ${item}: ${selected.value}\n`;


                    if (
                        selected.value ===
                        "Malo"
                    ) {

                        const textarea =
                            document.getElementById(
                                `textarea-${itemId}`
                            );


                        if (
                            textarea &&
                            textarea.value.trim()
                        ) {

                            message +=
                                `   Observación: ${textarea.value.trim()}\n`;

                        }

                    }

                }
            );


            message += "\n";

        }
    );


    message +=
        "================================\n";


    message +=
        "Checklist completado desde el sistema web PlayLand.\n";


    return message;

}


/* =========================================================
   GENERAR EXCEL
========================================================= */

downloadExcelBtn.addEventListener(
    "click",
    downloadExcel
);


function downloadExcel() {

    clearError();


    /*
       Verificar que todo esté contestado
    */

    for (
        let pageNumber = 1;
        pageNumber <= 9;
        pageNumber++
    ) {

        if (
            !validatePage(
                pageNumber,
                false
            )
        ) {

            currentPage =
                pageNumber;


            updatePage();


            showError(
                "No puedes generar el Excel todavía. Completa primero toda la inspección."
            );


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });


            return;

        }

    }


    /*
       Verificar librería Excel
    */

    if (
        typeof XLSX ===
        "undefined"
    ) {

        showError(
            "No se pudo cargar el módulo de Excel. Verifica tu conexión a Internet y vuelve a intentarlo."
        );


        return;

    }


    /* =====================================================
       HOJA 1 - DATOS
    ====================================================== */

    const datosInspeccion = [

        [
            "CHECKLIST VEHICULAR - PLAYLAND"
        ],

        [
            "Nissan NP300 de redilas"
        ],

        [],

        [
            "DATOS DE LA INSPECCIÓN"
        ],

        [
            "Campo",
            "Información"
        ],

        [
            "Fecha",
            getValue("fecha")
        ],

        [
            "Hora",
            getValue("hora")
        ],

        [
            "Unidad",
            getValue("unidad")
        ],

        [
            "Conductor",
            getValue("conductor")
        ],

        [
            "Kilometraje",
            getValue("kilometraje")
        ],

        [
            "Nivel de combustible",
            getValue("combustible")
        ],

        [
            "Tipo de inspección",
            getValue("tipoInspeccion")
        ]

    ];


    const hojaDatos =
        XLSX.utils.aoa_to_sheet(
            datosInspeccion
        );


    /* =====================================================
       HOJA 2 - CHECKLIST
    ====================================================== */

    const checklistRows = [

        [
            "Categoría",
            "Elemento revisado",
            "Resultado",
            "Observación"
        ]

    ];


    Object.keys(
        checklistData
    ).forEach(
        category => {

            const data =
                checklistData[
                    category
                ];


            data.items.forEach(
                (item, index) => {

                    const itemId =
                        `${category}-${index}`;


                    const selected =
                        document.querySelector(
                            `input[name="${itemId}"]:checked`
                        );


                    if (!selected) {
                        return;
                    }


                    let observation =
                        "";


                    if (
                        selected.value ===
                        "Malo"
                    ) {

                        const textarea =
                            document.getElementById(
                                `textarea-${itemId}`
                            );


                        if (textarea) {

                            observation =
                                textarea.value.trim();

                        }

                    }


                    checklistRows.push([

                        data.title,

                        item,

                        selected.value,

                        observation

                    ]);

                }
            );

        }
    );


    const hojaChecklist =
        XLSX.utils.aoa_to_sheet(
            checklistRows
        );


    /* =====================================================
       CREAR ARCHIVO
    ====================================================== */

    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(

        workbook,

        hojaDatos,

        "Datos de inspección"

    );


    XLSX.utils.book_append_sheet(

        workbook,

        hojaChecklist,

        "Checklist"

    );


    /* =====================================================
       ANCHOS DE COLUMNAS
    ====================================================== */

    hojaDatos["!cols"] = [

        {
            wch: 28
        },

        {
            wch: 38
        }

    ];


    hojaChecklist["!cols"] = [

        {
            wch: 30
        },

        {
            wch: 45
        },

        {
            wch: 15
        },

        {
            wch: 55
        }

    ];


    /* =====================================================
       NOMBRE DEL ARCHIVO
    ====================================================== */

    const unidad =
        getValue("unidad")
            .trim()
            .replace(
                /[^a-zA-Z0-9-_]/g,
                "_"
            );


    const fecha =
        getValue("fecha")
            .replace(
                /-/g,
                ""
            );


    const nombreArchivo =
        `Checklist_NP300_${unidad || "Unidad"}_${fecha || "SinFecha"}.xlsx`;


    /* =====================================================
       DESCARGAR
    ====================================================== */

    XLSX.writeFile(

        workbook,

        nombreArchivo

    );


    showSuccessMessage(

        `Excel generado correctamente: ${nombreArchivo}`

    );

}


/* =========================================================
   NUEVO CHECKLIST
========================================================= */

newChecklistBtn.addEventListener(
    "click",
    startNewChecklist
);


function startNewChecklist() {

    const confirmation =
        confirm(
            "¿Quieres iniciar un nuevo checklist?\n\nToda la información de esta inspección será borrada."
        );


    if (!confirmation) {
        return;
    }


    /* =========================
       DATOS GENERALES
    ========================== */

    document.getElementById(
        "unidad"
    ).value = "";


    document.getElementById(
        "conductor"
    ).value = "";


    document.getElementById(
        "kilometraje"
    ).value = "";


    document.getElementById(
        "combustible"
    ).value = "";


    document.getElementById(
        "tipoInspeccion"
    ).value = "";


    document.getElementById(
        "whatsapp"
    ).value = "";


    /* =========================
       FECHA Y HORA
    ========================== */

    setDateTime();


    /* =========================
       RESPUESTAS
    ========================== */

    const radios =
        document.querySelectorAll(
            '.status-option input[type="radio"]'
        );


    radios.forEach(
        radio => {

            radio.checked = false;

        }
    );


    /* =========================
       OBSERVACIONES
    ========================== */

    const textareas =
        document.querySelectorAll(
            ".observation textarea"
        );


    textareas.forEach(
        textarea => {

            textarea.value = "";

        }
    );


    const observations =
        document.querySelectorAll(
            ".observation"
        );


    observations.forEach(
        observation => {

            observation.classList.remove(
                "show"
            );

        }
    );


    /* =========================
       RESUMEN
    ========================== */

    document.getElementById(
        "summaryContainer"
    ).innerHTML = "";


    /* =========================
       REGRESAR AL INICIO
    ========================== */

    currentPage = 1;


    clearError();


    updatePage();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   MENSAJES DE ERROR
========================================================= */

function showError(message) {

    errorMessage.textContent =
        message;


    errorMessage.style.background =
        "";


    errorMessage.style.borderColor =
        "";


    errorMessage.style.color =
        "";


    errorMessage.classList.add(
        "show"
    );

}


function clearError() {

    errorMessage.textContent =
        "";


    errorMessage.classList.remove(
        "show"
    );


    errorMessage.style.background =
        "";


    errorMessage.style.borderColor =
        "";


    errorMessage.style.color =
        "";

}


/* =========================================================
   MENSAJE DE ÉXITO
========================================================= */

function showSuccessMessage(
    message
) {

    errorMessage.textContent =
        message;


    errorMessage.style.background =
        "#effff5";


    errorMessage.style.borderColor =
        "#b9ebca";


    errorMessage.style.color =
        "#187a45";


    errorMessage.classList.add(
        "show"
    );


    setTimeout(
        () => {

            errorMessage.classList.remove(
                "show"
            );


            errorMessage.style.background =
                "";


            errorMessage.style.borderColor =
                "";


            errorMessage.style.color =
                "";

        },
        5000
    );

}


/* =========================================================
   EVENTOS GLOBALES
========================================================= */

function attachGlobalEvents() {

    document
        .querySelectorAll(
            "input, select, textarea"
        )
        .forEach(
            element => {

                element.addEventListener(
                    "input",
                    clearError
                );


                element.addEventListener(
                    "change",
                    clearError
                );

            }
        );

}


/* =========================================================
   SEGURIDAD HTML
========================================================= */

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
