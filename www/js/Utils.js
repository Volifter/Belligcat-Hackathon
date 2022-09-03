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
}
