import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { AuthContext } from '../../../../Context/AuthContext'
import { Dropdown } from 'semantic-ui-react'
import { Slide, ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

function AddBook() {

    const API_URL = process.env.REACT_APP_API_URL
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useContext(AuthContext)

    const [bookName, setBookName] = useState("")
    const [alternateTitle, setAlternateTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [bookCountAvailable, setBookCountAvailable] = useState(null)
    const [language, setLanguage] = useState("")
    const [publisher, setPublisher] = useState("")
    const [allCategories, setAllCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [recentAddedBooks, setRecentAddedBooks] = useState([])
    const [bookImage, setBookImage] = useState()
    const onFileChange = (e) => {
        setBookImage(e.target.files[0]);
      };
    
    const toastId = 'added-book';
    
    /* Fetch all the Categories */
    useEffect(() => {
        const getAllCategories = async () => {
            try {
                const response = await axios.get(API_URL + "api/categories/allcategories")
                const all_categories = await response.data.map(category => (
                    { value: `${category._id}`, text: `${category.categoryName}` }
                ))
                setAllCategories(all_categories)
            }
            catch (err) {
                //console.log(err)
                toast.error('Could not added Book, please try again later', {
                    position: toast.POSITION.TOP_RIGHT,
                    toastId
                  });
            }
        }
        getAllCategories()
    }, [API_URL])

    /* Adding book function */
    const addBook = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        //const BookData = {
         //   bookName: bookName,
         //   alternateTitle: alternateTitle,
         //   author: author,
         //   bookCountAvailable: bookCountAvailable,
         //   language: language,
         //   publisher: publisher,
         //   categories: selectedCategories,
         //   bookImage: bookImage,
         //   isAdmin: user.isAdmin
        //}
        
        const formData = new FormData()
        formData.append("bookName",bookName);
        formData.append("alternateTitle", alternateTitle);
        formData.append("author", author);
        formData.append("bookCountAvailable", bookCountAvailable);
        formData.append("language", language);
        formData.append("publisher", publisher);
        formData.append("categories", selectedCategories);
        formData.append("bookImage", bookImage);
        formData.append("isAdmin", user.isAdmin);
        try {
            if(bookImage === undefined){
                toast.error('Book Image is required', {
                    position: toast.POSITION.TOP_RIGHT,
                    toastId
                  });
                  
            }    
           // const response = await axios.post(API_URL + "api/books/addbook", BookData)
           const response = await axios.post(API_URL + "api/books/addbook", formData, { headers: {'Content-Type': 'multipart/form-data'}})
            if (recentAddedBooks.length >= 5) {
                recentAddedBooks.splice(-1)
            }
            setRecentAddedBooks([response.data, ...recentAddedBooks])
            setBookName("")
            setAlternateTitle("")
            setAuthor("")
            setBookCountAvailable(0)
            setLanguage("")
            setPublisher("")
            setSelectedCategories([])
            setBookImage("")
    
            toast.success("Book Added Successfully", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000, //3 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId,
                transition: Slide
              });
            //alert("Book Added Successfully 🎉")
        }
        catch (err) {
            console.log(err)
            toast.error(err, {
                position: toast.POSITION.TOP_RIGHT,
                toastId
              });
        }
        setIsLoading(false)
    }


    useEffect(() => {
        const getallBooks = async () => {
            const response = await axios.get(API_URL + "api/books/allbooks")
            setRecentAddedBooks(response.data.slice(0, 5))
        }
        getallBooks()
    }, [API_URL])


    return (
        <div>
        
            <p className="dashboard-option-title">Add a Book</p>
            <div className="dashboard-title-line"></div>
            <div className="toast-container"><ToastContainer limit={2}/></div>
            <form className='addbook-form' onSubmit={addBook}>

                <label className="addbook-form-label" htmlFor="bookName">Book Name<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" name="bookName" value={bookName == null ? '' :bookName} onChange={(e) => { setBookName(e.target.value) }} required></input><br />

                <label className="addbook-form-label" htmlFor="alternateTitle">AlternateTitle</label><br />
                <input className="addbook-form-input" type="text" name="alternateTitle" value={alternateTitle == null ? '' : alternateTitle} onChange={(e) => { setAlternateTitle(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="author">Author Name<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" name="author" value={author == null ? '' : author} onChange={(e) => { setAuthor(e.target.value) }} required></input><br />

                <label className="addbook-form-label" htmlFor="language">Language</label><br />
                <input className="addbook-form-input" type="text" name="language" value={language == null ? '' : language} onChange={(e) => { setLanguage(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="publisher">Publisher</label><br />
                <input className="addbook-form-input" type="text" name="publisher" value={publisher == null ? '' : publisher} onChange={(e) => { setPublisher(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="copies">No.of Copies Available<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" name="copies" value={bookCountAvailable == null ? '' : bookCountAvailable} onChange={(e) => { setBookCountAvailable(e.target.value) }} required></input><br />
                <label className="addbook-form-label" htmlFor="bookImage">Book Image<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="file" name="bookImage" onChange={onFileChange} ></input><br />

                <label className="addbook-form-label" htmlFor="categories">Categories<span className="required-field">*</span></label><br />
                <div className="semanticdropdown">
                    <Dropdown
                        placeholder='Category'
                        fluid
                        multiple
                        search
                        selection
                        options={allCategories}
                        value={selectedCategories == null ? '' :selectedCategories}
                        onChange={(event, value) => setSelectedCategories(value.value)}
                    />
                </div>

                <input className="addbook-submit" type="submit" value="SUBMIT" disabled={isLoading}></input>
            </form>
            <div>
                <p className="dashboard-option-title">Recently Added Books</p>
                <div className="dashboard-title-line"></div>
                <table className='admindashboard-table'>
                    <tr>
                        <th>S.No</th>
                        <th>Book Name</th>
                        <th>Added Date</th>
                    </tr>
                    {
                        recentAddedBooks.map((book, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{book.bookName}</td>
                                    <td>{book.createdAt.substring(0, 10)}</td>
                                </tr>
                            )
                        })
                    }
                </table>
            </div>
        </div>
    )
}

export default AddBook