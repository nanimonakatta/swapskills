import multer from "multer";
import fs from "node:fs";
import path from "node:path";

const MAX_MEMORY_SIZE = 1 * 1024 * 1024; // 1MB

const fileFilter = function(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only images are allowed."));
  }
  cb(null, true);
}

const hybridUpload = multer({
  storage: {
    _handleFile(req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      const fileName = uniqueSuffix + "-" + file.originalname;
      const chunks = [];
      let totalSize = 0;
      let outStream = null;
      let isCallbackInvoked = false;
      let switchedToDisk = false;
      
      const onData = function(chunk) {
        if (isCallbackInvoked || switchedToDisk) return;
        chunks.push(chunk);
        totalSize += chunk.length;
        if (totalSize > MAX_MEMORY_SIZE) {
          switchedToDisk = true;
          const buffer = Buffer.concat(chunks, totalSize);
          const filePath = path.join(process.cwd(), "public/temp", fileName);
          outStream = fs.createWriteStream(filePath);
          outStream.on("finish", function() {
            if (isCallbackInvoked) return;
            isCallbackInvoked = true;
            fs.stat(filePath, function(err, stats) {
              if (err) return cb(err);
              cb(null, {
                path: filePath,
                size: stats.size,
                filename: fileName,
                originalname: file.originalname
              });
            });
          });
          outStream.on("error", (err) => {
            if (isCallbackInvoked) return;
            isCallbackInvoked = true;
            cb(err);
          });
          outStream.write(buffer, function(err) {
            if (err && !isCallbackInvoked) {
              isCallbackInvoked = true;
              return cb(err);
            } 
            file.stream.pipe(outStream);
          });

          file.stream.removeListener("data", onData);
          file.stream.removeListener("end", onEnd);
          file.stream.removeListener("error", onError);
          
        }
      }

      const onEnd = function() {
        if (isCallbackInvoked || switchedToDisk) return;
        if (totalSize <= MAX_MEMORY_SIZE) {
          isCallbackInvoked = true;
          const buffer = Buffer.concat(chunks, totalSize);
          cb(null, {
            buffer,
            size: buffer.length,
            originalname: file.originalname
          });
        }
      }

      const onError = function(err) {
        if (outStream) outStream.destroy();
        if (!isCallbackInvoked) {
          isCallbackInvoked = true;
          cb(err);
        }
      }

      file.stream.on("data", onData);
      file.stream.on("end", onEnd);
      file.stream.on("error", onError);
    },
    _removeFile: function(req, file, cb) {
      if (file.path) fs.unlink(file.path, cb);
      else cb(null);
    }
  },
  fileFilter,
  limits: { files: 2 }
});

export default hybridUpload;