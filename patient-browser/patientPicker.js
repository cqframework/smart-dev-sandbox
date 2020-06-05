/**
 * Opens the patient browser in popup window to select some patients
 * @param {String} selection (optional) Comma-separated list of patient IDs
 *                           to be pre-selected. This is a way to pass the
 *                           current selection (if any) that the host app
 *                           maintains. The user will see these IDs as selected
 *                           and will be able to make changes to the selection.
 * @return {Promise<String>} Returns a promise that will eventually be resolved
 *                           with the new selection.
 */
export default function selectPatients(selection) {
    return new Promise(function(resolve, reject) {
console.log("selectPatients got called");
        // The origin of the patient browser app
        let origin = "https://patient-browser.smarthealthit.org";

        // What config file to load
        let config = "r4-local"

        // Popup height
        let height = 700;

        // Popup width
        let width  = 1000;

        // Open the popup
        let popup  = window.open(
            origin + (
                selection ?
                    `/index.html?config=${config}#/?_selection=${encodeURIComponent(selection)}` :
                    ""
            ),
            "picker",
            [
                "height=" + height,
                "width=" + width,
                "menubar=0",
                "resizable=1",
                "status=0",
                "top=" + (screen.height - height) / 2,
                "left=" + (screen.width - width) / 2
            ].join(",")
        );

        // The function that handles incoming messages
        const onMessage = function onMessage(e) {

            // only if the message is coming from the patient picker
            if (e.origin === origin) {

                // OPTIONAL: Send your custom configuration options if needed
                // when the patient browser says it is ready
                if (e.data.type === 'ready') {
                    popup.postMessage({
                        type: 'config',
                        data: {
                            submitStrategy: "manual",
                            // ...
                        }
                    }, '*');
                }

                    // When the picker requests to be closed:
                    // 1. Stop listening for messages
                    // 2. Close the popup window
                // 3. Resolve the promise with the new selection (if any)
                else if (e.data.type === 'result' || e.data.type === 'close') {
                    window.removeEventListener('message', onMessage);
                    popup.close();
                    resolve(e.data.data);
                }
            }
        };

        // Now just wait for the user to interact with the patient picker
        window.addEventListener('message', onMessage);
    });
}

// onDOMReady (assuming that jQuery is available):
jQuery(function($) {

    // A button that will open the picker when clicked
    let button = $(".my-button");

    // An input that will display the selected patient IDs
    let input = $(".my-input");

    button.on("click", function() {
        let selection = input.val();
        selectPatients(selection).then(sel => {

            // ignore cancel and close cases
            if (sel || sel === "") {
                $("input", this).val(sel)
            }
        })
    })
});