
import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

function Camera_Function() {
  const [imageUrl, setImageUrl] = useState(null); // State để lưu URL của ảnh

  // Hàm chụp ảnh và lưu vào thư viện
  const takePhoto = async () => {
    try {
      // Mở camera và chụp ảnh
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri, // Sử dụng Uri để lấy đường dẫn ảnh
        source: CameraSource.Camera, // Mở camera trực tiếp
      });

      // Hiển thị ảnh ngay lập tức
      setImageUrl(image.webPath);

      // Chuyển đổi ảnh thành base64 để lưu vào bộ nhớ cục bộ
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const base64Data = await convertBlobToBase64(blob);

      // Lưu ảnh vào thư mục công khai (public directory)
      const fileName = `photo_${new Date().getTime()}.jpeg`;
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents, // Thư mục công khai
        recursive: true, // Tạo thư mục nếu chưa tồn tại
      });

      console.log('Ảnh đã được lưu:', savedFile.uri);

      // Lưu thông tin ảnh vào Preferences (tùy chọn)
      await Preferences.set({
        key: 'savedImage',
        value: savedFile.uri,
      });

      // Hiển thị thông báo thành công
      alert('Ảnh đã được lưu vào thư viện!');
    } catch (error) {
      console.error('Lỗi khi chụp hoặc lưu ảnh:', error);
      alert('Có lỗi xảy ra khi lưu ảnh.');
    }
  };

  // Hàm truy cập thư viện ảnh và lấy ảnh vừa chụp
  const accessPhotoLibrary = async () => {
    try {
      // Mở thư viện ảnh và chọn ảnh
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri, // Sử dụng Uri để lấy đường dẫn ảnh
        source: CameraSource.Photos, // Mở thư viện ảnh
      });

      // Hiển thị ảnh được chọn
      setImageUrl(image.webPath);
    } catch (error) {
      console.error('Lỗi khi truy cập thư viện ảnh:', error);
      alert('Có lỗi xảy ra khi truy cập thư viện ảnh.');
    }
  };

  // Hàm chuyển đổi Blob sang base64
  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result.split(',')[1]); // Loại bỏ phần đầu của data URL
      };
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div>
      <div className="camera-buttons">
        <button className="camera-button" onClick={takePhoto}>
          <i className="fas fa-camera"></i> Chụp Ảnh
        </button>
        <button className="camera-button" onClick={accessPhotoLibrary}>
          <i className="fas fa-images"></i> Thư viện Ảnh
        </button>
      </div>
      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <img src={imageUrl} alt="Ảnh đã lưu" style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }} />
        </div>
      )}
    </div>
  );
}

export default Camera_Function;