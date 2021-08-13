import React, { useState } from 'react'

export default function Home(props) {
    const [URL, setURL] = useState("")
    function validate(URL){

    }
    return (
        <div>
            <form action="/spoof" className="text-black">
                <input type="text" name="url" id="url" onChange={e => setURL(e.target.value)} value={URL} />
                <input type="button" value="Spoof" />
            </form>
        </div>
    )
}
