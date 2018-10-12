let gulp = require("gulp");
let minify = require("gulp-minify");
let cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const babel = require("gulp-babel");

gulp.task("compress", function() {
  gulp
    .src("src/js/*.js")
    .pipe(
      babel({
        presets: ["babel-preset-env"].map(require.resolve)
      })
    )
    .pipe(minify())
    .pipe(gulp.dest("dist/js/"));
});

gulp.task("minify-css", () => {
  return gulp
    .src("src/css/*.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(concat("lightboxV.min.css"))
    .pipe(gulp.dest("dist/css/"));
});

gulp.task("dev", ["compress", "minify-css"]);
