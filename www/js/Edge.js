export default class Edge {
    constructor(node_from, node_to, $line) {
        this. nodeFrom = node_from;
        this.nodeTo = node_to;
        this.$line = $line;
    }

    update() {
        const _x = this.nodeFrom.pos.x;
        const _y = this.nodeFrom.pos.y;
        const x = this.nodeTo.pos.x;
        const y = this.nodeTo.pos.y;
        const x_off = x - _x;
        const y_off = y - _y;
        const dist = Math.sqrt(Math.pow(x_off, 2) + Math.pow(y_off, 2));
        const ratio = Math.abs((dist - 125) / dist);

        this.$line.setAttribute("x1", _x);
        this.$line.setAttribute("y1", _y);
        this.$line.setAttribute("x2", _x + x_off * ratio);
        this.$line.setAttribute("y2", _y + y_off * ratio);
    }
}
