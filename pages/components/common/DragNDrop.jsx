import { Form, Header, Icon, Image, Segment } from 'semantic-ui-react';

const DragNDrop = ({
  highlighted,
  setHighlighted,
  inputRef,
  handleChange,
  media,
  setMedia,
  mediaPreview,
  setMediaPreview,
}) => {
  return (
    <>
      <Form.Field>
        <Segment placeholder secondary>
          <input
            style={{ display: 'none' }}
            type="file"
            accept="image/*"
            onChange={handleChange}
            name="media"
            ref={inputRef}
            // onInput={ (e) => {
            //   e.preventDefault();
            //   if(e.target.files.length != 1) return;
            //   console.log(e.target.files);
            //   const droppedFile = e.target.files[0]
            //   setMedia(droppedFile)
            //   setMediaPreview(URL.createObjectURL(droppedFile))
            // }}
          />
          <div
            style={{ cursor: 'pointer' }}
            onDragOver={ (e) => {
              e.preventDefault();
              setHighlighted(true)
            }}
            onDragLeave={ (e) => {
              e.preventDefault()
            }}
            onDrop={ (e) => {
              e.preventDefault();
              setHighlighted(true)
              
              // console.log(e.dataTransfer.files)
              const droppedFile = e.dataTransfer.files[0]
              setMedia(droppedFile)
              setMediaPreview(URL.createObjectURL(droppedFile))
            }}
            onClick={ (e) => inputRef.current.click()}
          >
            {mediaPreview === null ? (
              <>
                <Segment placeholder basic {...(highlighted && {color: 'green'})}>
                  <Header icon>
                    <Icon name="file image outline" />
                    Drag and Drop Image to Upload
                  </Header>
                </Segment>
              </>
            ) : (
              <>
                <Segment placeholder basic>
                  <Image 
                    src={mediaPreview}
                    size="medium"
                    centered
                    style={{cursor: 'pointer'}}
                    // onClick={ () => inputRef.current.click()}
                  />
                </Segment>
                
              </>
            )}
          </div>
        </Segment>
      </Form.Field>
    </>
  );
};

export default DragNDrop;
