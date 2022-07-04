export default function Greetings() {
  function handleSayHello() {
    window.Main.sendMessage('Hello World');

    console.log('Message sent! Check main process log in terminal.')
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleSayHello}
      >
        Send message to main process
      </button>
    </div>
  )
}

