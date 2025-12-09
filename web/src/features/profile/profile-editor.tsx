import { useState, useRef } from 'react';

import { CameraIcon, XIcon } from '@/components/ui/icons';

import { AlertMessage } from '@/components/errors/alert-message';
import { AvatarProfile } from '@/components/profile/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAvatarUpload, useProfileUpdate } from '@/hooks/user';

import type { ProfileEditorProps } from '@/types/user';

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ user }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Use hooks directly in component
  const {
    uploadAvatar,
    isUploading,
    error: uploadError,
    previewUrl,
    setPreviewUrl,
  } = useAvatarUpload();

  const { updateProfile, isUpdating, error: updateError } = useProfileUpdate();

  // Avatar upload handlers
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFilePreview(file);
      // Just preview - don't auto-upload until user confirms
    }
  };

  const handleFilePreview = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return; // Let the upload hook handle validation
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviewUrl(previewUrl);
  };

  const handleAvatarUpload = async () => {
    const selectedFile = fileInputRef.current?.files?.[0];
    if (selectedFile) {
      try {
        await uploadAvatar(selectedFile);
        // Clear preview after successful upload since the user context will update
        handleCancelPreview();
      } catch (error) {
        // Error is handled by the hook
        console.error('Avatar upload failed:', error);
      }
    }
  };

  const handleCancelPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        // Update the file input
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;
        }
        handleFilePreview(file);
      }
    }
  };

  // Profile form submission handler (separate from avatar upload)
  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const profileData = {
      fullName: formData.get('name') as string,
      username: formData.get('username') as string,
      bio: (formData.get('bio') as string) || undefined, // Convert empty string to undefined
      // Note: email updates removed for security - should require separate verification flow
    };

    try {
      // Only update profile data - avatar is handled separately
      await updateProfile(profileData);
      setIsDialogOpen(false); // Close dialog on success
    } catch (error) {
      // Error is handled by the hook
      console.error('Profile update failed:', error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleProfileSubmit}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            {/* Profile Update Error Messages */}
            {updateError ? (
              <AlertMessage message={updateError} type="error" />
            ) : (
              <DialogDescription>
                Update your profile information below. Choose an image to preview, then click Upload
                to confirm.
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="grid gap-6 my-2">
            {/* Avatar Upload Section */}
            <div className="grid gap-3">
              <Label>Profile Image</Label>
              <div className="flex flex-col items-center gap-4">
                {/* Avatar Display with Drag & Drop */}
                <div className="relative group" onDragOver={handleDragOver} onDrop={handleDrop}>
                  {user && (
                    <AvatarProfile
                      avatarUrl={user.avatarUrl}
                      fullName={user.fullName}
                      email={user.email}
                    />
                  )}

                  {/* Upload Overlay */}
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={handleAvatarClick}
                  >
                    <CameraIcon clIconassName="w-6 h-6 text-white" />
                  </div>

                  {/* Cancel Preview Button */}
                  {previewUrl && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                      onClick={handleCancelPreview}
                    >
                      <XIcon className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                {/* Upload Buttons */}
                <div className="flex justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAvatarClick}
                    disabled={isUploading}
                  >
                    <CameraIcon clIconassName="w-4 h-4 mr-2" />
                    {previewUrl ? 'Change Image' : 'Choose Image'}
                  </Button>

                  {previewUrl && (
                    <Button type="button" onClick={handleAvatarUpload} disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        'Upload Avatar'
                      )}
                    </Button>
                  )}
                </div>
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Upload Error Message */}
                {uploadError && <AlertMessage message={uploadError} type="error" />}

                {/* Upload Instructions */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Supported formats: JPG, PNG, GIF, WebP
                    <br /> Max file size: 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Form Fields */}
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input
                id="username-1"
                name="username"
                defaultValue={user?.username || ''}
                placeholder="Enter username"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="name-1">Full Name</Label>
              <Input
                id="name-1"
                name="name"
                defaultValue={user?.fullName || ''}
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="bio-1">Bio</Label>
              <Input
                id="bio-1"
                multiline={true}
                name="bio"
                defaultValue={user?.bio || ''}
                placeholder="Enter your bio"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCancelPreview}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isUpdating || isUploading}>
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Updating Profile...
                </>
              ) : (
                'Save Profile Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
