const cl = console.log;
const cardcontainer = document.getElementById('cardcontainer')
const inputform = document.getElementById('inputform')
const name = document.getElementById('name')
const email = document.getElementById('email')
const body = document.getElementById('body')
const postId = document.getElementById('postId')
const addpost = document.getElementById('addpost')
const updatepost = document.getElementById('updatepost')
const spinner = document.getElementById('spinner')

let commentArr =[]

let Base_url ='https://jsonplaceholder.typicode.com/comments'



function snackbar(msg,icon){
    swal.fire({
        title : msg,
        icon : icon,
        timer : 3000
    })
}

function fetchproducts (){
    spinner.classList.remove('d-none')
    let xhr = new XMLHttpRequest()


    xhr.open('GET',Base_url)

    xhr.send(null)

    xhr.onload = function(){
        postArr = JSON.parse(xhr.response)
        
        createposts(postArr.reverse())
        
    }

}

fetchproducts()



function createposts(arr){
    let result = ''
    arr.forEach((ele,i) =>{
       
        result +=`<div class="col-md-6 my-4" id=${ele.id}>
					<div class="card h-100">
						<div class="card-header bg-info">
							<strong>Email</strong> : <h2>${ele.email} </h2>
						</div>
						<div class="card-body">
							<strong>NAME</strong> :<h3> ${ele.name} </h3>
							<p>${ele.body}</p>
						</div>
						<div class="card-footer d-flex justify-content-between">
							<button class="btn btn-primary btn-sm " onclick = 'onedit(this)'>Edit</button>
							<button class="btn btn-danger btn-sm " onclick = 'onremove(this)'>Remove</button>

						</div>
					</div>
				</div>`
    })


    cardcontainer.innerHTML =result


    spinner.classList.add('d-none')
}

function onsubmit(ele){
    spinner.classList.remove('d-none')
    
    ele.preventDefault()

    let newobj = {
        name : name.value,
        email : email.value,
        body : body.value,
        postId : postId.value,
    }

    commentArr.unshift(newobj)

    let xhr = new XMLHttpRequest()

    xhr.open('POST',Base_url)

    xhr.send(JSON.stringify(newobj))

    xhr.onload = function(){
       if(xhr.status >=200 && xhr.status <=299){
         let res =JSON.parse( xhr.response)

        addnewcard(newobj,res)
       }


    }




}


function addnewcard(newobj,response){
    let div = document.createElement('div')
    let offset = ``
    

    div.className = `col-md-6 my-4`
    div.id = response.id


    div.innerHTML = `<div class="card h-100">
						<div class="card-header bg-info">
							<strong>Email</strong> : <h2>${newobj.email} </h2>
						</div>
						<div class="card-body">
							<strong>NAME</strong> :<h3> ${newobj.name} </h3>
							<p>${newobj.body}</p>
						</div>
						<div class="card-footer d-flex justify-content-between">
							<button class="btn btn-primary btn-sm " onclick = 'onedit(this)' >Edit</button>
							<button class="btn btn-danger btn-sm " onclick ='onremove(this)'>Remove</button>

						</div>
					</div>`


    cardcontainer.prepend(div)


    inputform.reset()
    spinner.classList.add('d-none')


    snackbar(`The New Comment id ${response.id} is added successfull!!`,'success')


}


function onedit(ele){
    spinner.classList.remove('d-none')
    
    let editId = ele.closest('.col-md-6').id
    localStorage.setItem('EditId',editId)
    let Post_url = `${Base_url}/${editId}`

    let xhr = new XMLHttpRequest()

    xhr.open('GET',Post_url)

    xhr.send(null)

    xhr.onload = function(){
       if(xhr.status >=200 && xhr.status <=299){
        let EditObj = JSON.parse(xhr.response)

        name.value = EditObj.name
        email.value = EditObj.email
        body.value = EditObj.body
        postId.value = EditObj.postId


        addpost.classList.add('d-none')
        updatepost.classList.remove('d-none')

       }else{

        let err = xhr.response

        snackbar(err,'error')

       }


    }

    spinner.classList.add('d-none')
    

}


function onupdate(){
    let updateId = localStorage.getItem('EditId')
    spinner.classList.remove('d-none')

    let updateObj ={
        name : name.value,
        email : email.value,
        body : body.value,
        postId : postId.value,
        id : updateId
    }

    let PUT_url = `${Base_url}/${updateId}`
    let xhr = new XMLHttpRequest()

    xhr.open('PUT',PUT_url)

    xhr.send(JSON.stringify(updateObj))

    xhr.onload = function(){
       if(xhr.status >= 200 && xhr.status <= 299){
         
        let div = document.getElementById(updateId)

        let h2 = div.querySelector('.card-header h2')

        h2.innerText = updateObj.email

        let h3 = div.querySelector('.card-body h3')
        h3.innerText = updateObj.name

        let p = div.querySelector('.card-body p')

        p.innerText = updateObj.body

        snackbar(`The Comment id ${updateId} is Updated successfully!!`,'success')

        addpost.classList.remove('d-none')
        updatepost.classList.add('d-none')
       }else{
        let err = xhr.response

        snackbar(err,'error')
       }
    }
    spinner.classList.add('d-none')
    
}


function onremove(ele){
    let removeId = ele.closest('.col-md-6').id
    spinner.classList.remove('d-none')

    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
    
    let Remove_url = `${Base_url}/${removeId}`

    let xhr = new XMLHttpRequest()

    xhr.open('DELETE',Remove_url)

    xhr.send(null)

    xhr.onload = function(){

        ele.closest('.col-md-6').remove();

        snackbar(`The Comment id ${removeId} is removed Successfully!!!`,'success')

    }


    spinner.classList.add('d-none')
    
  }
});

}







inputform.addEventListener('submit',onsubmit)
updatepost.addEventListener('click',onupdate)