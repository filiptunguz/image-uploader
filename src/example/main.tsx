import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ImageUploader from "../components/ImageUploader.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ImageUploader />
  </StrictMode>,
)
