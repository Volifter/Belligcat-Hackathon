export default class Utils {
    static setToggleable(
        target_selector,
        class_name,
        trigger_selector = null,
        cb = null
    ) {
        const $target = document.querySelector(target_selector);
        const $trigger = trigger_selector
            ? document.querySelector(trigger_selector)
            : $target;

        $trigger.addEventListener("click", () => {
            cb?.();
            $target.classList.toggle(class_name);
        });
    }

    static createSVGElement(name, $parent = null, attributes = {}) {
        const $element = document.createElementNS(
            "http://www.w3.org/2000/svg",
            name
        );

        $parent?.append($element);

        Object.entries(attributes).forEach(
            ([key, val]) => $element.setAttribute(key, val)
        );

        return $element;
    }

    static pickFile(type) {
        return new Promise(resolve => {
            let input = document.createElement("input");
            input.type = "file";
            input.accept = type;

            input.onchange = () => {
                resolve(input.files[0]);
            };

            input.click();
        });
    }

    static convertImageToBase64(file) {
        return new Promise(resolve => {
            const reader = new FileReader();

            reader.addEventListener("load", e => resolve(e.target.result));
            reader.readAsDataURL(file);
        })
    }

    static capitalize(str) {
        return str[0].toLocaleUpperCase() + str.substring(1);
    }
}
