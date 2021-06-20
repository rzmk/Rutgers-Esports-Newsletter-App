const express = require('express')
const mailchimp = require("@mailchimp/mailchimp_marketing")

const app = express()

app.use(express.static(__dirname))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

mailchimp.setConfig({
    apiKey: process.env.MC_API_KEY,
    server: process.env.MC_SERVER
})

app.post("/", (req, res) => {
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email

    async function addContact(contactData) {
        try {
            const response = await mailchimp.lists.addListMember(process.env.MC_LIST_ID, contactData)
            console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}`)
            res.sendFile(__dirname + "/success.html")
        }
        catch(err) {
            // console.log(err)
            res.sendFile(__dirname + "/failure.html")
        }
    }

    const contactObject = 
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    EMAIL: email,
                    FNAME: firstName,
                    LNAME: lastName
                }
            }

    const payload = JSON.stringify(contactObject)
    addContact(payload)
    // console.log(firstName + lastName + email)
    // console.log(payload)
})

app.listen(process.env.PORT || '3000', (req, res) => {
    console.log("Server is running.")
})