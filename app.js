class controls {
  colors = null;
  size = null;
  mode = null;
  filling = false;
  ctx = null;

  set Colors(newColor) {
    if (newColor) {
      this.colors = newColor;
      this.handleColor();
    }
  }
  set Size(newRange) {
    if (newRange) {
      this.size = newRange;
      this.handleSize();
    }
  }
  set Mode(newMode) {
    if (newMode) {
      this.mode = newMode;
      this.handleMode();
    }
  }

  set Context(target) {
    if (target) {
      this.ctx = target.getContext("2d");
    }
  }

  get Context() {
    if (this.ctx) {
      return this.ctx;
    }
  }

  handleColor() {
    this.colors.forEach((color) =>
      color.addEventListener("click", (event) => {
        const color = event.target.style.backgroundColor;
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
      })
    );
  }

  handleSize() {
    this.size.addEventListener("input", (event) => {
      const size = event.target.value;
      this.ctx.lineWidth = size;
    });
  }

  handleMode() {
    this.mode.addEventListener("click", (event) => {
      if (this.filling === false) {
        this.filling = true;
        this.mode.innerText = "Paint";
      } else {
        this.filling = false;
        this.mode.innerText = "Fill";
      }
    });
  }
}

class Paint extends controls {
  target = null;
  width = 0;
  height = 0;
  painting = false;
  save = null;
  INITIAL_COLOR = "#2c2c2c";

  constructor(target, width, height) {
    super();
    this.target = target;
    super.Context = this.target;
    this.target.width = width;
    this.target.height = height;
    super.Context.fillStyle = "white";
    super.Context.fillRect(0, 0, this.target.width, this.target.height);
    super.Context.strokeStyle = this.INITIAL_COLOR;
    super.Context.fillStyle = this.INITIAL_COLOR;
    super.Context.lineWidth = 2.5;
  }

  set Save(newSave) {
    if (newSave) {
      this.save = newSave;
      this.handleSave();
    }
  }

  handleSave() {
    console.log(this.save);
    this.save.addEventListener("click", () => {
      const image = this.target.toDataURL();
      const link = document.createElement("a");
      link.href = image;
      link.download = "picture";
      link.click();
    });
  }

  onMouseMove() {
    this.target.addEventListener("mousemove", (event) => {
      const x = event.offsetX;
      const y = event.offsetY;
      if (!this.painting) {
        super.Context.beginPath();
        super.Context.moveTo(x, y);
      } else {
        super.Context.lineTo(x, y);
        super.Context.stroke();
      }
    });
  }

  onMouseDown() {
    this.target.addEventListener("mousedown", () => {
      this.painting = true;
    });
  }

  onMouseUp() {
    this.target.addEventListener("mouseup", () => (this.painting = false));
  }

  onMouseLeave() {
    this.target.addEventListener("mouseleave", () => (this.painting = false));
  }

  onMouseClick() {
    this.target.addEventListener("click", () => {
      if (this.filling) {
        super.Context.fillRect(0, 0, this.target.width, this.target.height);
      }
    });
  }
  removeContextMenu() {
    this.target.addEventListener("contextmenu", (event) =>
      event.preventDefault()
    );
  }
}

const canvas = new Paint(document.getElementById("jsCanvas"), 700, 700);

if (canvas.target) {
  canvas.onMouseMove();
  canvas.onMouseDown();
  canvas.onMouseUp();
  canvas.onMouseLeave();
  canvas.onMouseClick();
  canvas.removeContextMenu();
  canvas.Colors = document.querySelectorAll(".controls__color");
  canvas.Size = document.getElementById("jsRange");
  canvas.Mode = document.getElementById("jsMode");
  canvas.Save = document.getElementById("jsSave");
}
