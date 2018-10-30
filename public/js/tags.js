<script type="text/javascript">
        $(function(){
            $('#tagButton').click(function(e){
                e.preventDefault();
                var data = {};
                data.tag = document.getElementById("tag").value;
                data.color = document.getElementById("tagColor").value;

                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: 'http://localhost:8080/addTag',
                    success: function(data) {
                        console.log('success');
                        var newTag = data;
                        $(".tags").append("<div class='form-check'><input type='checkbox' class='form-check-input' id='featured' name=tags[" + newTag.tag + "] >" +
                          "<label><span class='badge' style='background-color:" + newTag.color + ";'>" + newTag.tag + "</span>&nbsp;<button type='button' class='close removeTagButton' aria-label='Close'" +
                          "value='" + newTag.tag + "'><span aria-hidden='true'>&times;</span></button></label></div>");
                    }
                });
            });
        });
        $(function(){
            $('.removeTagButton').click(function(e){
                e.preventDefault();
                var data = {};
                data.tag = $(this).val();;

                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: 'http://localhost:8080/removeTag',
                    success: function() {
                        console.log('success');
                        $(".tags").children("#"+data.tag).remove();
                    }
                });
            });
        });
</script>
