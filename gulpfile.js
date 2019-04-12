let gulp = require("gulp");
let minify = require("gulp-minify");
const babel = require("gulp-babel");
const sass = require("gulp-sass");

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

gulp.task("sass", function() {
  return gulp
    .src("src/sass/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("dev", ["sass", "compress"]);
