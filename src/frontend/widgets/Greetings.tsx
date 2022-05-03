import Button from 'react-bootstrap/Button';

export default function Greetings() {
  function handleSayHello() {
    window.Main.sendMessage('Hello World');

    console.log('Message sent! Check main process log in terminal.')
  }

  return (
    <div>
      <Button onClick={handleSayHello}>Send message to main process</Button>
    </div>
  )
}
 
