export async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary is configured
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      reject(new Error("Cloudinary cloud name not configured"));
      return;
    }

    // Validate file
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("File size exceeds 5MB limit"));
      return;
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      reject(
        new Error(
          `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(", ")}`,
        ),
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cars_upload");
    // Add additional parameters for better debugging
    formData.append("folder", "cars_image");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    console.log("Uploading to Cloudinary:", {
      cloudName,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadUrl,
    });

    fetch(uploadUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        console.log("Cloudinary response status:", response.status);

        if (!response.ok) {
          // Try to get error details from response
          return response
            .json()
            .then((errorData) => {
              console.error("Cloudinary error details:", errorData);
              if (errorData.error) {
                reject(
                  new Error(
                    `Cloudinary error (${response.status}): ${errorData.error.message || JSON.stringify(errorData.error)}`,
                  ),
                );
              } else {
                reject(new Error(`HTTP error! status: ${response.status}`));
              }
            })
            .catch(() => {
              reject(
                new Error(
                  `HTTP error! status: ${response.status} - Unable to get error details`,
                ),
              );
            });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Cloudinary upload response:", data);

        if (data.secure_url) {
          resolve(data.secure_url);
        } else if (data.error) {
          reject(new Error(`Cloudinary error: ${data.error.message}`));
        } else {
          reject(new Error("Upload failed - no secure URL returned"));
        }
      })
      .catch((error) => {
        console.error("Cloudinary upload error:", error);
        reject(error);
      });
  });
}

export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  // If Cloudinary is not configured, return placeholder URLs
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    console.warn("Cloudinary not configured, returning placeholder URLs");
    console.warn("Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to your .env file");
    return files.map(
      (file, index) =>
        `https://via.placeholder.com/400x300?text=Image+${index + 1}+(${file.name})`,
    );
  }

  console.log("Cloudinary is configured, attempting upload...");
  console.log("Cloud name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  console.log(
    "Files to upload:",
    files.map((f) => f.name),
  );

  // Try with different upload presets or fallback
  const presets = ["cars_upload", "ml_default", "unsigned"];

  for (const preset of presets) {
    try {
      console.log(`Trying upload preset: ${preset}`);
      const uploadPromises = files.map((file) =>
        uploadImageWithPreset(file, preset),
      );
      const urls = await Promise.all(uploadPromises);
      console.log(`✅ Successfully uploaded with preset: ${preset}`);
      console.log("Upload URLs:", urls);
      return urls;
    } catch (error) {
      console.warn(`❌ Failed with preset ${preset}:`, error);
      if (preset === presets[presets.length - 1]) {
        // Last preset failed, use placeholders
        console.warn("All upload presets failed, using placeholder URLs");
        console.warn("Common issues:");
        console.warn("1. Upload preset does not exist");
        console.warn("2. Cloudinary cloud name is wrong");
        console.warn("3. Upload preset is not set to Unsigned mode");
        return files.map(
          (file, index) =>
            `https://via.placeholder.com/400x300?text=Cloudinary+Error+${index + 1}+(${file.name})`,
        );
      }
    }
  }

  return [];
}

export async function uploadImageWithPreset(
  file: File,
  preset: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      reject(new Error("Cloudinary cloud name not configured"));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
    formData.append("folder", "cars_image");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    fetch(uploadUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response
            .json()
            .then((errorData) => {
              if (errorData.error) {
                reject(
                  new Error(
                    `Cloudinary error (${response.status}): ${errorData.error.message || JSON.stringify(errorData.error)}`,
                  ),
                );
              } else {
                reject(new Error(`HTTP error! status: ${response.status}`));
              }
            })
            .catch(() => {
              reject(new Error(`HTTP error! status: ${response.status}`));
            });
        }
        return response.json();
      })
      .then((data) => {
        if (data.secure_url) {
          resolve(data.secure_url);
        } else if (data.error) {
          reject(new Error(`Cloudinary error: ${data.error.message}`));
        } else {
          reject(new Error("Upload failed - no secure URL returned"));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
