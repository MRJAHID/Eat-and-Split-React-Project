import './App.css';
import {useState} from "react";

const initialFriends = [
    {
        id: 118836,
        name: "Clark",
        image: "https://i.pravatar.cc/48?u=118836",
        balance: -7,
    },
    {
        id: 933372,
        name: "Sarah",
        image: "https://i.pravatar.cc/48?u=933372",
        balance: 20,
    },
    {
        id: 499476,
        name: "Anthony",
        image: "https://i.pravatar.cc/48?u=499476",
        balance: 0,
    },
];

function Button({children, onClick}) {
    return <button onClick={onClick} className='button'>{children}</button>
}

export default function App() {
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [friends, setFriends] = useState(initialFriends);
    const [selectedFriend, setSelectedFriend] = useState(null);

    function handleShowAddFriend() {
        setShowAddFriend(show => !show);
    }

    function handleAddFriend(friend) {
        setFriends(friends => [...friends, friend])
        setShowAddFriend(false)
    }

    function handleSelectFriend(friend) {
        setSelectedFriend(selected  => selected?.id === friend?.id ? null : friend);
        setShowAddFriend(false)
    }

    return (
        <div className="app">
            <div className="sidebar">
                <FriendsList selectedFriend={selectedFriend} friends={friends} onSelectFriend={handleSelectFriend}/>

                {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend}/>}

                <Button onClick={handleShowAddFriend}>{showAddFriend ? 'Close' : 'Add Friend'}</Button>
            </div>

            {
                selectedFriend && <FormSplitBill selectedFriend={selectedFriend}/>
            }
        </div>
    );
}

function FriendsList({friends, onSelectFriend, selectedFriend}) {
    return <ul>
        {friends.map(friend => <Friend key={friend.id} selectedFriend={selectedFriend} friend={friend}
                                       onSelectFriend={onSelectFriend}/>)}
    </ul>
}

function Friend({friend, onSelectFriend, selectedFriend}) {
    const isSelected = selectedFriend?.id === friend.id;

    return <li className={isSelected ? 'selected' : ''}>
        <img src={friend.image} alt={friend.name}/>
        <h2>{friend.name}</h2>
        {friend.balance < 0 && <p className='red'>You Owe {friend.name} ${Math.abs(friend.balance)}</p>}
        {friend.balance > 0 && <p className='green'>{friend.name} Owes You ${Math.abs(friend.balance)}</p>}
        {friend.balance === 0 && <p>You and your friend are even.</p>}

        <Button onClick={() => onSelectFriend(friend)}>{isSelected ? 'Close' : 'Select'}</Button>
    </li>
}


function FormAddFriend({onAddFriend}) {
    const [name, setName] = useState();
    const [image, setImage] = useState('https://i.pravatar.cc/48?u=499476');

    function handleSubmit(e) {
        e.preventDefault();

        if (!name || !image) return;

        const id = crypto.randomUUID();
        const newFriend = {
            id,
            name,
            image: `${image}?=${id}`,
            balance: 0,
        };

        onAddFriend(newFriend)

        setName('');
        setImage('https://i.pravatar.cc/48');
    }

    return <form className='form-add-friend' onSubmit={handleSubmit}>
        <label> 🧑‍🤝‍🧑 Friend Name</label>
        <input type='text' value={name} onChange={(e) => setName(e.target.value)}/>

        <label> 🌌Image Url</label>
        <input type='text' value={image} onChange={(e) => setImage(e.target.value)}/>

        <Button>Add</Button>
    </form>
}

function FormSplitBill({selectedFriend}) {
    return <form className='form-split-bill'>
        <h2>Split a bill with {selectedFriend.name}</h2>

        <label>💰 Bill Value</label>
        <input type='text'/>

        <label>🧍‍♂️ Your Expense</label>
        <input type='text'/>

        <label>🧑‍🤝‍🧑 {selectedFriend.name}'s Expense</label>
        <input type='text'/>

        <label>🤑 Who is paying bill?</label>
        <select>
            <option value='user'>You</option>
            <option value='friend'>{selectedFriend.name}</option>
        </select>

        <Button>Split Bill</Button>
    </form>
}