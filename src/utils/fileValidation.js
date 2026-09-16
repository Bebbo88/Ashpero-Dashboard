// Client-side guardrails mirroring the server-side multer limits, so an
// oversized/wrong-type file is rejected instantly instead of after a slow
// upload round-trip that the server then rejects anyway.

const BYTES_PER_MB = 1024 * 1024;

// Filters a FileList/array down to files that pass size + type checks.
// Rejected files are reported via `onReject(file, reason)` so the caller can
// surface them however it likes (alert, inline text, etc).
export function filterValidFiles(
  files,
  { maxSizeMB, acceptPrefix = "image/", onReject } = {}
) {
  const list = Array.from(files || []);
  const maxBytes = maxSizeMB * BYTES_PER_MB;
  const validFiles = [];

  for (const file of list) {
    if (acceptPrefix && !file.type?.startsWith(acceptPrefix)) {
      onReject?.(file, `"${file.name}" is not a valid ${acceptPrefix.replace("/", "")} file.`);
      continue;
    }

    if (file.size > maxBytes) {
      onReject?.(file, `"${file.name}" is ${(file.size / BYTES_PER_MB).toFixed(1)}MB, which exceeds the ${maxSizeMB}MB limit.`);
      continue;
    }

    validFiles.push(file);
  }

  return validFiles;
}

export function validateFiles(files, options) {
  const rejectedMessages = [];
  const validFiles = filterValidFiles(files, {
    ...options,
    onReject: (_file, reason) => rejectedMessages.push(reason),
  });

  if (rejectedMessages.length > 0) {
    window.alert(rejectedMessages.join("\n"));
  }

  return validFiles;
}
