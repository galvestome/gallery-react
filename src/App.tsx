import { useState, useEffect, FormEvent } from 'react';
import { Container, Area, Header, ScreenWarning, PhotoList, UploadForm } from './App.styles';
import { getAll, insert } from './services/photos';
import { Photo } from './types/Photo';
import { PhotoItem } from './componentes/PhotoItem';

const App = () => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        const getPhotos = async () => {
            setLoading(true);
            setPhotos(await getAll());
            setLoading(false);
        }
        getPhotos();
    }, []);

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const file = formData.get('image') as File;

        if (file && file.size > 0) {
            setUploading(true);
            let result = await insert(file);
            setUploading(false);

            if(result instanceof Error) {
                alert(`${result.name} = ${result.message}`);
            } else {
                let newPhotoList = [...photos];
                newPhotoList.push(result);
                setPhotos(newPhotoList);
            }
        }
    }

    return (
        <Container>
            <Area>
                <Header>Galeria de Fotos</Header>

                <UploadForm method="POST" onSubmit={handleFormSubmit}>
                    <input type="file" name="image" />
                    <input type="submit" value="Enviar" />
                    {uploading && "Enviando..."}
                </UploadForm>

                {loading && 
                    <ScreenWarning>
                        <div className="emoji">🤚</div>
                        <div>Carregando...</div>
                    </ScreenWarning>
                }

                {!loading && photos.length > 0 &&
                    <PhotoList>
                        {photos.map((item, index) => (
                            <PhotoItem key={index} url={item.url} name={item.name} />
                        ))}
                    </PhotoList>
                }

                {!loading && photos.length === 0 &&
                    <ScreenWarning>
                        <div className="emoji">😞</div>
                        <div>Não há fotos cadastradas.</div>
                    </ScreenWarning>
                }
            </Area>
        </Container>
    )
}

export default App;
